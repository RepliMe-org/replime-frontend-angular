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
import { ListFormState, getInitialListFormState, openListForm, discardListForm, isItemDuplicateInForm, isItemAlreadySaved } from '../../../../shared/utils/list-form.utils';

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

  formState: ListFormState = getInitialListFormState();
  targetCategoryId: number | null = null;

  constructor(
    private chatbotClassificationsService: ChatbotClassificationsService,
    private chatbotCategoryService: ChatbotCategoryService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.chatbotCategoryService.getCategories().subscribe({
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
    openListForm(this.formState);
    this.targetCategoryId = null;
  }

  discardAddForm() {
    discardListForm(this.formState);
    this.targetCategoryId = null;
  }

  saveNewClassifications() {
    if (!this.targetCategoryId) {
      this.formState.formError = 'Please select a target category.';
      return;
    }

    this.formState.triggerListValidation = true;

    const namesToCreate = this.formState.newItems
      .map((item) => item.value.trim())
      .filter(Boolean);

    if (!namesToCreate.length) {
      this.formState.formError = 'Enter at least one classification name.';
      return;
    }

    if (namesToCreate.length !== this.formState.newItems.length) {
      this.formState.formError = 'All fields must be filled in.';
      return;
    }

    if (this.formState.duplicateItemFlags.some(Boolean)) {
      this.formState.formError = 'Remove duplicates before saving.';
      return;
    }

    if (this.formState.existingItemFlags.some(Boolean)) {
      this.formState.formError = 'One or more names already exist in this category.';
      return;
    }

    this.formState.saving = true;

    this.chatbotClassificationsService
      .createMessageClasses(this.targetCategoryId, namesToCreate)
      .subscribe({
        next: () => {
          this.toast.success('Classifications saved successfully.');
          this.formState.saving = false;
          this.discardAddForm();
          this.loadAll();
        },

        error: () => {
          this.toast.error('Failed to save. Please try again.');
          this.formState.formError = 'Failed to save. Please try again.';
          this.formState.saving = false;
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
    this.formState.newItems = items;
    this.formState.formError = '';
    this.updateValidationFlags();
  }

  updateValidationFlags() {
    this.formState.duplicateItemFlags = this.formState.newItems.map((_, index) =>
      isItemDuplicateInForm(this.formState.newItems, index),
    );

    const targetCategory = this.categoriesWithClasses.find(
      (c) => c.id === this.targetCategoryId,
    );
    const existingNames = targetCategory ? targetCategory.messageClasses.map(m => m.name.toLowerCase()) : [];

    this.formState.existingItemFlags = this.formState.newItems.map((_, index) =>
      isItemAlreadySaved(this.formState.newItems, index, existingNames),
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
