import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminClassificationsComponent } from './admin-classifications.component';
import { ChatbotClassificationsService } from '../../../../core/services/chatbot-classifications.service';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  ChatbotCategory,
  MessageClass,
  CategoryWithClasses,
} from '../../../../core/models/chatbot-category.model';
import { InputListItem } from '../../../../shared/ui/dynamic-input-list/dynamic-input-list.model';

const mockCategories: ChatbotCategory[] = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Gaming' },
];

const mockClassesByCategory: MessageClass[][] = [
  [
    { id: 10, name: 'Bug Report' },
    { id: 11, name: 'Feature Request' },
  ],
  [{ id: 20, name: 'Game Tips' }],
];

describe('AdminClassificationsComponent', () => {
  let component: AdminClassificationsComponent;
  let fixture: ComponentFixture<AdminClassificationsComponent>;
  let mockClassificationsService: jasmine.SpyObj<ChatbotClassificationsService>;
  let mockCategoryService: jasmine.SpyObj<ChatbotCategoryService>;
  let mockToast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockClassificationsService = jasmine.createSpyObj(
      'ChatbotClassificationsService',
      ['getMessageClasses', 'createMessageClasses', 'deleteMessageClass'],
    );
    mockCategoryService = jasmine.createSpyObj('ChatbotCategoryService', [
      'getCategories',
    ]);
    mockToast = jasmine.createSpyObj('ToastService', ['success', 'error']);

    mockCategoryService.getCategories.and.returnValue(of(mockCategories));
    mockClassificationsService.getMessageClasses.and.callFake((id: number) => {
      const idx = mockCategories.findIndex((c) => c.id === id);
      return of(mockClassesByCategory[idx] ?? []);
    });

    await TestBed.configureTestingModule({
      imports: [
        AdminClassificationsComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: ChatbotClassificationsService,
          useValue: mockClassificationsService,
        },
        { provide: ChatbotCategoryService, useValue: mockCategoryService },
        { provide: ToastService, useValue: mockToast },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadAll()', () => {
    it('should populate allCategories and categoriesWithClasses on success', () => {
      expect(component.allCategories).toEqual(mockCategories);
      expect(component.categoriesWithClasses.length).toBe(2);
      expect(component.categoriesWithClasses[0].messageClasses).toEqual(
        mockClassesByCategory[0],
      );
      expect(component.categoriesWithClasses[1].messageClasses).toEqual(
        mockClassesByCategory[1],
      );
      expect(component.loading).toBeFalse();
    });

    it('should call toast.error and set loading false when getCategories fails', () => {
      mockCategoryService.getCategories.and.returnValue(
        throwError(() => new Error('fail')),
      );
      component.loadAll();
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to load categories.',
      );
      expect(component.loading).toBeFalse();
    });

    it('should handle empty categories list without calling getMessageClasses', () => {
      mockCategoryService.getCategories.and.returnValue(of([]));
      mockClassificationsService.getMessageClasses.calls.reset();
      component.loadAll();
      expect(component.categoriesWithClasses).toEqual([]);
      expect(
        mockClassificationsService.getMessageClasses,
      ).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should call toast.error when forkJoin of getMessageClasses fails, and keep empty messageClasses', () => {
      mockClassificationsService.getMessageClasses.and.returnValue(
        throwError(() => new Error('fail')),
      );
      component.loadAll();
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to load classifications.',
      );
      expect(
        component.categoriesWithClasses.every(
          (c) => c.messageClasses.length === 0,
        ),
      ).toBeTrue();
      expect(component.loading).toBeFalse();
    });
  });

  describe('openAddForm() / discardAddForm()', () => {
    it('openAddForm should set formState.showAddForm to true and reset targetCategoryId', () => {
      component.targetCategoryId = 5;
      component.openAddForm();
      expect(component.formState.showAddForm).toBeTrue();
      expect(component.targetCategoryId).toBeNull();
    });

    it('discardAddForm should set formState.showAddForm to false and reset targetCategoryId', () => {
      component.openAddForm();
      component.targetCategoryId = 3;
      component.discardAddForm();
      expect(component.formState.showAddForm).toBeFalse();
      expect(component.targetCategoryId).toBeNull();
    });
  });

  describe('saveNewClassifications()', () => {
    beforeEach(() => {
      component.openAddForm();
      component.targetCategoryId = 1;
      component.formState.newItems = [{ value: 'New Class', localId: 1 }];
    });

    it('should set formError when no targetCategoryId', () => {
      component.targetCategoryId = null;
      component.saveNewClassifications();
      expect(component.formState.formError).toBeTruthy();
      expect(
        mockClassificationsService.createMessageClasses,
      ).not.toHaveBeenCalled();
    });

    it('should set formError when newItems is empty', () => {
      component.formState.newItems = [];
      component.saveNewClassifications();
      expect(component.formState.formError).toContain('at least one');
    });

    it('should set formError when items have blank values', () => {
      component.formState.newItems = [{ value: '   ', localId: 1 }];
      component.saveNewClassifications();
      expect(component.formState.formError).toBeTruthy();
    });

    it('should set formError when duplicateItemFlags has a true', () => {
      component.formState.newItems = [
        { value: 'Dup', localId: 1 },
        { value: 'Dup', localId: 2 },
      ];
      component.formState.duplicateItemFlags = [false, true];
      component.saveNewClassifications();
      expect(component.formState.formError).toContain('duplicates');
    });

    it('should set formError when existingItemFlags has a true', () => {
      component.formState.newItems = [{ value: 'Bug Report', localId: 1 }];
      component.formState.existingItemFlags = [true];
      component.saveNewClassifications();
      expect(component.formState.formError).toContain('already exist');
    });

    it('should call createMessageClasses and reset form on success', () => {
      mockClassificationsService.createMessageClasses.and.returnValue(of(null));
      component.saveNewClassifications();
      expect(
        mockClassificationsService.createMessageClasses,
      ).toHaveBeenCalledWith(1, ['New Class']);
      expect(mockToast.success).toHaveBeenCalledWith(
        'Classifications saved successfully.',
      );
      expect(component.formState.showAddForm).toBeFalse();
    });

    it('should call toast.error on createMessageClasses failure', () => {
      mockClassificationsService.createMessageClasses.and.returnValue(
        throwError(() => new Error('fail')),
      );
      component.saveNewClassifications();
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to save. Please try again.',
      );
      expect(component.formState.saving).toBeFalse();
    });
  });

  describe('deleteClassification()', () => {
    const cls: MessageClass = { id: 10, name: 'Bug Report' };

    it('should call toast.success and reload on success', () => {
      mockClassificationsService.deleteMessageClass.and.returnValue(of(null));
      spyOn(component, 'loadAll');
      component.deleteClassification(1, cls);
      expect(
        mockClassificationsService.deleteMessageClass,
      ).toHaveBeenCalledWith(1, 10);
      expect(mockToast.success).toHaveBeenCalledWith('"Bug Report" deleted.');
      expect(component.loadAll).toHaveBeenCalled();
    });

    it('should call toast.error on failure', () => {
      mockClassificationsService.deleteMessageClass.and.returnValue(
        throwError(() => new Error('fail')),
      );
      component.deleteClassification(1, cls);
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to delete classification.',
      );
    });
  });

  describe('onClassificationItemsChanged()', () => {
    it('should update formState.newItems and clear formError', () => {
      component.formState.formError = 'Old error';
      const items: InputListItem[] = [{ value: 'Test', localId: 1 }];
      component.onClassificationItemsChanged(items);
      expect(component.formState.newItems).toEqual(items);
      expect(component.formState.formError).toBe('');
    });
  });

  describe('updateValidationFlags()', () => {
    it('should detect duplicate items in newItems', () => {
      component.formState.newItems = [
        { value: 'Dup', localId: 1 },
        { value: 'Dup', localId: 2 },
      ];
      component.updateValidationFlags();
      expect(component.formState.duplicateItemFlags.some(Boolean)).toBeTrue();
    });

    it('should detect existing item names against selected category', () => {
      component.targetCategoryId = 1;
      component.formState.newItems = [{ value: 'Bug Report', localId: 1 }];
      component.updateValidationFlags();
      expect(component.formState.existingItemFlags[0]).toBeTrue();
    });

    it('should not flag items from a different category', () => {
      component.targetCategoryId = 2;
      component.formState.newItems = [{ value: 'Bug Report', localId: 1 }];
      component.updateValidationFlags();
      expect(component.formState.existingItemFlags[0]).toBeFalse();
    });
  });

  describe('totalClassificationCount()', () => {
    it('should return sum of all messageClasses across all categories', () => {
      expect(component.totalClassificationCount()).toBe(3);
    });

    it('should return 0 when categoriesWithClasses is empty', () => {
      component.categoriesWithClasses = [];
      expect(component.totalClassificationCount()).toBe(0);
    });
  });

  describe('visibleCategories()', () => {
    it('should return all categories when no filter or search', () => {
      component.categoryFilter = '';
      component.searchQuery = '';
      expect(component.visibleCategories().length).toBe(2);
    });

    it('should filter by categoryFilter when set', () => {
      component.categoryFilter = '1';
      component.searchQuery = '';
      const result = component.visibleCategories();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });

    it('should filter messageClasses by searchQuery', () => {
      component.categoryFilter = '';
      component.searchQuery = 'Bug';
      const result = component.visibleCategories();
      const techCategory = result.find((c) => c.id === 1);
      expect(techCategory).toBeTruthy();
      expect(techCategory!.messageClasses.length).toBe(1);
      expect(techCategory!.messageClasses[0].name).toBe('Bug Report');
    });

    it('should include a category when category name matches search but no classes match', () => {
      component.categoryFilter = '';
      component.searchQuery = 'Gaming';
      const result = component.visibleCategories();
      const gaming = result.find((c) => c.id === 2);
      expect(gaming).toBeTruthy();
    });
  });

  describe('trackBy helpers', () => {
    it('trackByCategoryId should return category id', () => {
      const cat = {
        id: 3,
        name: 'Music',
        messageClasses: [],
      } as CategoryWithClasses;
      expect(component.trackByCategoryId(0, cat)).toBe(3);
    });

    it('trackByClassificationId should return classification id', () => {
      const cls: MessageClass = { id: 7, name: 'Other' };
      expect(component.trackByClassificationId(0, cls)).toBe(7);
    });
  });
});
