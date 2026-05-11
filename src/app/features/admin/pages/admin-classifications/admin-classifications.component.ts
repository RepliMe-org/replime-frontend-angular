import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ChatbotClassificationsService } from '../../../../core/services/chatbot-classifications.service';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { DynamicInputListComponent } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.component';
import { forkJoin } from 'rxjs';
import {
  CategoryWithClasses,
  ChatbotCategory,
  MessageClass,
} from '../../../../core/models/chatbot-category.model';
import { InputListItem } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-classifications',
  standalone: true,
  imports: [SharedModule, DynamicInputListComponent],
  templateUrl: './admin-classifications.component.html',
  styleUrls: ['./admin-classifications.component.css'],
})
export class AdminClassificationsComponent implements OnInit {
  allCategories: ChatbotCategory[] = [];
  categoriesWithClasses: CategoryWithClasses[] = [];
  loading = false;
  searchQuery = '';
  categoryFilter = '';

  showAddForm = false;
  targetCategoryId: number | null = null;
  newClassificationItems: InputListItem[] = [];
  formError = '';
  saving = false;

  duplicateItemFlags: boolean[] = [];
  existingItemFlags: boolean[] = [];

  triggerListValidation = false;

  nextItemId = 0;

  constructor(
    private chatbotClassificationsService: ChatbotClassificationsService,
    private ChatbotCategoryService: ChatbotCategoryService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.ChatbotCategoryService.getCategories().subscribe({
      next: (categories) => this.onLoadSuccess(categories),
      error: () => {
        this.toast.error('Failed to load categories.');
        this.loading = false;
      },
    });
  }

  onLoadSuccess(categories) {
    this.allCategories = categories;
    if (!categories.length) {
      this.categoriesWithClasses = [];
      this.loading = false;
      return;
    }
    forkJoin(
      categories.map((c) =>
        this.chatbotClassificationsService.getMessageClasses(c.id),
      ),
    ).subscribe({
      next: (classesPerCategory) => {
        this.categoriesWithClasses = categories.map((c, i) => ({
          ...c,
          messageClasses: classesPerCategory[i] ?? [],
        }));
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load classifications.');
        this.categoriesWithClasses = categories.map((c) => ({
          ...c,
          messageClasses: [],
        }));
        this.loading = false;
      },
    });
  }

  openAddForm() {
    this.newClassificationItems = [
      {
        localId: ++this.nextItemId,
        value: '',
      },
    ];
    this.duplicateItemFlags = [];
    this.existingItemFlags = [];
    this.targetCategoryId = null;
    this.formError = '';
    this.showAddForm = true;
  }

  discardAddForm() {
    this.showAddForm = false;
    this.newClassificationItems = [];
    this.duplicateItemFlags = [];
    this.existingItemFlags = [];
    this.targetCategoryId = null;
    this.formError = '';
    this.triggerListValidation = false;
  }

  saveNewClassifications() {
    if (!this.targetCategoryId) {
      this.formError = 'Please select a target category.';
      return;
    }

    this.triggerListValidation = true;

    const namesToCreate = this.newClassificationItems
      .map((item) => item.value.trim())
      .filter(Boolean);

    if (!namesToCreate.length) {
      this.formError = 'Enter at least one classification name.';
      return;
    }

    if (namesToCreate.length !== this.newClassificationItems.length) {
      this.formError = 'All fields must be filled in.';
      return;
    }

    if (this.duplicateItemFlags.some(Boolean)) {
      this.formError = 'Remove duplicates before saving.';
      return;
    }

    if (this.existingItemFlags.some(Boolean)) {
      this.formError = 'One or more names already exist in this category.';
      return;
    }

    this.saving = true;

    this.chatbotClassificationsService
      .createMessageClasses(this.targetCategoryId, namesToCreate)
      .subscribe({
        next: () => {
          this.toast.success('Classifications saved successfully.');
          this.saving = false;
          this.discardAddForm();
          this.loadAll();
        },

        error: () => {
          this.toast.error('Failed to save. Please try again.');
          this.formError = 'Failed to save. Please try again.';
          this.saving = false;
        },
      });
  }

  deleteClassification(categoryId: number, classification: MessageClass) {
    this.chatbotClassificationsService
      .deleteMessageClass(categoryId, classification.id)
      .subscribe({
        next: () => {
          this.toast.success(`"${classification.name}" deleted.`);
          this.loadAll();
        },
        error: () => this.toast.error('Failed to delete classification.'),
      });
  }
  trackByCategoryId(index: number, cat: CategoryWithClasses) {
    return cat.id;
  }
  trackByClassificationId(index: number, cls: MessageClass) {
    return cls.id;
  }

  onClassificationItemsChanged(items: InputListItem[]) {
    this.newClassificationItems = items;
    this.formError = '';
    this.updateValidationFlags();
  }

  updateValidationFlags() {
    this.duplicateItemFlags = this.newClassificationItems.map((_, index) =>
      this.isItemDuplicateInForm(index),
    );

    this.existingItemFlags = this.newClassificationItems.map((_, index) =>
      this.isItemAlreadySavedInTargetCategory(index),
    );
  }

  isItemDuplicateInForm(index: number) {
    const value = this.newClassificationItems[index]?.value
      .toLowerCase()
      .trim();
    if (!value) return false;
    return this.newClassificationItems.some(
      (item, i) => i !== index && item.value.toLowerCase().trim() === value,
    );
  }

  isItemAlreadySavedInTargetCategory(index: number) {
    if (!this.targetCategoryId) return false;
    const value = this.newClassificationItems[index]?.value
      .toLowerCase()
      .trim();
    if (!value) return false;
    const targetCategory = this.categoriesWithClasses.find(
      (c) => c.id === this.targetCategoryId,
    );
    return (
      targetCategory?.messageClasses.some(
        (m) => m.name.toLowerCase() === value,
      ) ?? false
    );
  }

  totalClassificationCount() {
    return this.categoriesWithClasses.reduce(
      (sum, c) => sum + c.messageClasses.length,
      0,
    );
  }

  visibleCategories() {
    let list = this.categoriesWithClasses;

    if (this.categoryFilter) {
      list = list.filter((c) => String(c.id) === this.categoryFilter);
    }

    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return list;

    return list
      .map((c) => ({
        ...c,
        messageClasses: c.messageClasses.filter((m) =>
          m.name.toLowerCase().includes(query),
        ),
      }))
      .filter(
        (c) => c.messageClasses.length || c.name.toLowerCase().includes(query),
      );
  }
}
