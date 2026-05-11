import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { DynamicInputListComponent } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.component';
import { ChatbotCategory } from '../../../../core/models/chatbot-category.model';
import { InputListItem } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.model';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [SharedModule, DynamicInputListComponent],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: ChatbotCategory[] = [];
  filteredCategories: ChatbotCategory[] = [];
  loading = false;
  searchQuery = '';

  showAddForm = false;
  newCategoryItems: InputListItem[] = [];
  formError = '';
  saving = false;

  triggerListValidation = false;

  duplicateItemFlags: boolean[] = [];
  existingItemFlags: boolean[] = [];

  nextItemId = 0;

  constructor(private ChatbotCategoryService: ChatbotCategoryService, private toast: ToastService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.ChatbotCategoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.applySearchFilter();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load categories.');
        this.loading = false;
      },
    });
  }

  applySearchFilter() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCategories = query
      ? this.categories.filter((c) => c.name.toLowerCase().includes(query))
      : [...this.categories];
  }

  saveNewCategories() {
    this.triggerListValidation = true;

    const namesToCreate = this.newCategoryItems
      .map((item) => item.value.trim())
      .filter(Boolean);

    if (!namesToCreate.length) {
      this.formError = 'Enter at least one category name.';
      return;
    }

    if (namesToCreate.length !== this.newCategoryItems.length) {
      this.formError = 'All fields must be filled in.';
      return;
    }

    if (this.duplicateItemFlags.some(Boolean)) {
      this.formError = 'Remove duplicates before saving.';
      return;
    }

    if (this.existingItemFlags.some(Boolean)) {
      this.formError = 'One or more names already exist.';
      return;
    }

    this.saving = true;

    this.ChatbotCategoryService.createCategories(namesToCreate).subscribe({
      next: () => {
        this.toast.success('Categories saved successfully.');
        this.saving = false;
        this.discardAddForm();
        this.loadCategories();
      },
      error: () => {
        this.toast.error('Failed to save. Please try again.');
        this.formError = 'Failed to save. Please try again.';
        this.saving = false;
      },
    });
  }

  openAddForm() {
    this.newCategoryItems = [
      {
        localId: ++this.nextItemId,
        value: '',
      },
    ];
    this.duplicateItemFlags = [];
    this.existingItemFlags = [];
    this.formError = '';
    this.showAddForm = true;
  }

  discardAddForm() {
    this.showAddForm = false;
    this.newCategoryItems = [];
    this.duplicateItemFlags = [];
    this.existingItemFlags = [];
    this.formError = '';
    this.triggerListValidation = false;
  }

  deleteCategory(category: ChatbotCategory) {
    this.ChatbotCategoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.toast.success(`"${category.name}" deleted.`);
        this.loadCategories();
      },
      error: () => this.toast.error('Failed to delete category.'),
    });
  }

  onCategoryItemsChanged(items: InputListItem[]) {
    this.newCategoryItems = items;
    this.formError = '';
    this.updateValidationFlags();
  }

  updateValidationFlags() {
    this.duplicateItemFlags = this.newCategoryItems.map((_, index) =>
      this.isItemDuplicateInForm(index),
    );

    this.existingItemFlags = this.newCategoryItems.map((_, index) =>
      this.isItemAlreadySavedAsCategory(index),
    );
  }

  isItemDuplicateInForm(index: number) {
    const value = this.newCategoryItems[index]?.value.toLowerCase().trim();
    if (!value) return false;
    return this.newCategoryItems.some(
      (item, i) => i !== index && item.value.toLowerCase().trim() === value,
    );
  }

  isItemAlreadySavedAsCategory(index: number) {
    const value = this.newCategoryItems[index]?.value.toLowerCase().trim();
    if (!value) return false;
    return this.categories.some((c) => c.name.toLowerCase() === value);
  }

  onSearchChange (query: string) {
    this.searchQuery = query;
    this.applySearchFilter();
  }
}
