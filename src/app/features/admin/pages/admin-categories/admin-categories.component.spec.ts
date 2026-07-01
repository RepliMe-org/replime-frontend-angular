import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AdminCategoriesComponent } from './admin-categories.component';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ChatbotCategory } from '../../../../core/models/chatbot-category.model';
import { InputListItem } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.model';

describe('AdminCategoriesComponent', () => {
  let component: AdminCategoriesComponent;
  let fixture: ComponentFixture<AdminCategoriesComponent>;

  let categoryService: jasmine.SpyObj<ChatbotCategoryService>;
  let toast: jasmine.SpyObj<ToastService>;

  const mockCategories: ChatbotCategory[] = [
    {
      id: 1,
      name: 'Technology',
    },
    {
      id: 2,
      name: 'Gaming',
    },
    {
      id: 3,
      name: 'Music',
    },
  ];

  beforeEach(async () => {
    categoryService = jasmine.createSpyObj('ChatbotCategoryService', [
      'getCategories',
      'createCategories',
      'deleteCategory',
    ]);

    toast = jasmine.createSpyObj('ToastService', ['success', 'error']);

    categoryService.getCategories.and.returnValue(of(mockCategories));
    categoryService.createCategories.and.returnValue(of(void 0));
    categoryService.deleteCategory.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        AdminCategoriesComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: ChatbotCategoryService,
          useValue: categoryService,
        },
        {
          provide: ToastService,
          useValue: toast,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadCategories()', () => {
    it('should load categories', () => {
      expect(component.categories).toEqual(mockCategories);
      expect(component.filteredCategories).toEqual(mockCategories);
      expect(component.loading).toBeFalse();
    });

    it('should show error toast when loading fails', () => {
      categoryService.getCategories.and.returnValue(
        throwError(() => new Error()),
      );

      component.loadCategories();

      expect(component.loading).toBeFalse();
      expect(toast.error).toHaveBeenCalledWith('Failed to load categories.');
    });
  });

  describe('applySearchFilter()', () => {
    it('should filter categories by search query', () => {
      component.searchQuery = 'tech';

      component.applySearchFilter();

      expect(component.filteredCategories.length).toBe(1);
      expect(component.filteredCategories[0].name).toBe('Technology');
    });

    it('should return all categories when search is empty', () => {
      component.searchQuery = '';

      component.applySearchFilter();

      expect(component.filteredCategories.length).toBe(3);
    });
  });

  describe('onSearchChange()', () => {
    it('should update search query and apply filter', () => {
      spyOn(component, 'applySearchFilter');

      component.onSearchChange('gaming');

      expect(component.searchQuery).toBe('gaming');
      expect(component.applySearchFilter).toHaveBeenCalled();
    });
  });

  describe('openAddForm()', () => {
    it('should open the add form', () => {
      component.openAddForm();

      expect(component.formState.showAddForm).toBeTrue();
      expect(component.formState.newItems.length).toBe(1);
      expect(component.formState.newItems[0].value).toBe('');
    });
  });

  describe('discardAddForm()', () => {
    it('should reset the form state', () => {
      component.formState.showAddForm = true;
      component.formState.newItems = [
        {
          localId: 1,
          value: 'Tech',
        },
      ];

      component.formState.formError = 'Error';
      component.formState.triggerListValidation = true;

      component.discardAddForm();

      expect(component.formState.showAddForm).toBeFalse();
      expect(component.formState.newItems).toEqual([]);
      expect(component.formState.formError).toBe('');
      expect(component.formState.triggerListValidation).toBeFalse();
    });
  });

  describe('saveNewCategories()', () => {
    beforeEach(() => {
      component.formState.newItems = [{ value: 'Science' } as InputListItem];
      component.formState.duplicateItemFlags = [false];
      component.formState.existingItemFlags = [false];
    });

    it('should save categories successfully', () => {
      spyOn(component, 'loadCategories');
      spyOn(component, 'discardAddForm');

      component.saveNewCategories();

      expect(categoryService.createCategories).toHaveBeenCalledWith([
        'Science',
      ]);
      expect(toast.success).toHaveBeenCalledWith(
        'Categories saved successfully.',
      );
      expect(component.discardAddForm).toHaveBeenCalled();
      expect(component.loadCategories).toHaveBeenCalled();
    });

    it('should fail when there are no names', () => {
      component.formState.newItems = [];

      component.saveNewCategories();

      expect(component.formState.formError).toBe(
        'Enter at least one category name.',
      );
      expect(categoryService.createCategories).not.toHaveBeenCalled();
    });

    it('should fail when some fields are empty', () => {
      component.formState.newItems = [
        { value: 'Science' } as InputListItem,
        { value: '' } as InputListItem,
      ];

      component.saveNewCategories();

      expect(component.formState.formError).toBe(
        'All fields must be filled in.',
      );
    });

    it('should fail when duplicate names exist', () => {
      component.formState.duplicateItemFlags = [true];

      component.saveNewCategories();

      expect(component.formState.formError).toBe(
        'Remove duplicates before saving.',
      );
    });

    it('should fail when category already exists', () => {
      component.formState.existingItemFlags = [true];

      component.saveNewCategories();

      expect(component.formState.formError).toBe(
        'One or more names already exist.',
      );
    });

    it('should handle save failure', () => {
      categoryService.createCategories.and.returnValue(
        throwError(() => new Error()),
      );

      component.saveNewCategories();

      expect(component.formState.saving).toBeFalse();
      expect(component.formState.formError).toBe(
        'Failed to save. Please try again.',
      );
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to save. Please try again.',
      );
    });
  });

  describe('deleteCategory()', () => {
    it('should delete category successfully', () => {
      spyOn(component, 'loadCategories');

      component.deleteCategory(mockCategories[0]);

      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('"Technology" deleted.');
      expect(component.loadCategories).toHaveBeenCalled();
    });

    it('should show error toast when delete fails', () => {
      categoryService.deleteCategory.and.returnValue(
        throwError(() => new Error()),
      );

      component.deleteCategory(mockCategories[0]);

      expect(toast.error).toHaveBeenCalledWith('Failed to delete category.');
    });
  });

  describe('onCategoryItemsChanged()', () => {
    it('should update items, clear error and update validation', () => {
      spyOn(component, 'updateValidationFlags');

      const items = [{ value: 'Science' } as InputListItem];

      component.formState.formError = 'Error';

      component.onCategoryItemsChanged(items);

      expect(component.formState.newItems).toEqual(items);
      expect(component.formState.formError).toBe('');
      expect(component.updateValidationFlags).toHaveBeenCalled();
    });
  });

  describe('updateValidationFlags()', () => {
    it('should populate duplicate and existing flags', () => {
      component.formState.newItems = [
        { value: 'Technology' } as InputListItem,
        { value: 'Technology' } as InputListItem,
      ];

      component.updateValidationFlags();

      expect(component.formState.duplicateItemFlags.length).toBe(2);
      expect(component.formState.existingItemFlags.length).toBe(2);
      expect(component.formState.existingItemFlags.every(Boolean)).toBeTrue();
    });
  });

  describe('trackByCategoryId()', () => {
    it('should return category id', () => {
      expect(component.trackByCategoryId(0, mockCategories[1])).toBe(2);
    });
  });
});
