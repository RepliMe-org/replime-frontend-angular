import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ChatbotCategory } from '../../../../core/models/chatbot-category.model';
import { InputListItem } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.model';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { filterByQuery } from '../../../../shared/utils/filter.utils';
import { ListFormState, getInitialListFormState, openListForm, discardListForm, isItemDuplicateInForm, isItemAlreadySaved } from '../../../../shared/utils/list-form.utils';
import { DynamicInputListComponent } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.component';

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

  formState: ListFormState = getInitialListFormState();

  constructor(private chatbotCategoryService: ChatbotCategoryService, private toast: ToastService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.chatbotCategoryService.getCategories().subscribe({
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
    this.filteredCategories = filterByQuery(this.categories, this.searchQuery, ['name']);
  }

  saveNewCategories() {
    this.formState.triggerListValidation = true;

    const namesToCreate = this.formState.newItems
      .map((item) => item.value.trim())
      .filter(Boolean);

    if (!namesToCreate.length) {
      this.formState.formError = 'Enter at least one category name.';
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
      this.formState.formError = 'One or more names already exist.';
      return;
    }

    this.formState.saving = true;

    this.chatbotCategoryService.createCategories(namesToCreate).subscribe({
      next: () => {
        this.toast.success('Categories saved successfully.');
        this.formState.saving = false;
        this.discardAddForm();
        this.loadCategories();
      },
      error: () => {
        this.toast.error('Failed to save. Please try again.');
        this.formState.formError = 'Failed to save. Please try again.';
        this.formState.saving = false;
      },
    });
  }

  openAddForm() {
    openListForm(this.formState);
  }

  discardAddForm() {
    discardListForm(this.formState);
  }

  deleteCategory(category: ChatbotCategory) {
    this.chatbotCategoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.toast.success(`"${category.name}" deleted.`);
        this.loadCategories();
      },
      error: () => this.toast.error('Failed to delete category.'),
    });
  }

  onCategoryItemsChanged(items: InputListItem[]) {
    this.formState.newItems = items;
    this.formState.formError = '';
    this.updateValidationFlags();
  }

  updateValidationFlags() {
    this.formState.duplicateItemFlags = this.formState.newItems.map((_, index) =>
      isItemDuplicateInForm(this.formState.newItems, index),
    );

    const existingNames = this.categories.map(c => c.name.toLowerCase());
    this.formState.existingItemFlags = this.formState.newItems.map((_, index) =>
      isItemAlreadySaved(this.formState.newItems, index, existingNames),
    );
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  trackByCategoryId(index: number, category: ChatbotCategory): number {
    return category.id;
  }
}
