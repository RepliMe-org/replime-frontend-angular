import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ClassificationsComponent } from './classifications.component';
import { InfluencerClassificationsService } from '../../../services/influencer-classifications.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MessageClass } from '../../../../../core/models/chatbot-category.model';

describe('ClassificationsComponent', () => {
  let component: ClassificationsComponent;
  let fixture: ComponentFixture<ClassificationsComponent>;
  let mockClassificationsService: jasmine.SpyObj<InfluencerClassificationsService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockAvailableClasses: MessageClass[] = [{ id: 1, name: 'General' }, { id: 2, name: 'Support' }];
  const mockPickedClasses: MessageClass[] = [{ id: 3, name: 'Billing' }];
  const mockCustomClasses: MessageClass[] = [{ id: 4, name: 'Refund' }];

  beforeEach(async () => {
    mockClassificationsService = jasmine.createSpyObj('InfluencerClassificationsService', [
      'getMessageClasses', 'addPickedClass', 'deleteMessageClass', 'addCustomClass'
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', ['success', 'error']);

    mockClassificationsService.getMessageClasses.and.returnValue(of({
      category: { id: 1, name: 'Test Category' },
      pickedClasses: [...mockPickedClasses],
      customClasses: [...mockCustomClasses],
      availableClasses: [...mockAvailableClasses]
    }));

    await TestBed.configureTestingModule({
      imports: [ClassificationsComponent, HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: InfluencerClassificationsService, useValue: mockClassificationsService },
        { provide: ToastService, useValue: mockToastService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load classifications on init', () => {
      expect(mockClassificationsService.getMessageClasses).toHaveBeenCalled();
      expect(component.categoryName).toBe('Test Category');
      expect(component.pickedClasses).toEqual(mockPickedClasses);
      expect(component.customClasses).toEqual(mockCustomClasses);
      expect(component.availableClasses).toEqual(mockAvailableClasses);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading classifications', () => {
      mockClassificationsService.getMessageClasses.and.returnValue(throwError(() => new Error('Error')));
      component.ngOnInit();
      expect(mockToastService.error).toHaveBeenCalledWith('Failed to load classifications. Please refresh.');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Total Selected', () => {
    it('should return the correct total of picked and custom classes', () => {
      expect(component.totalSelected()).toBe(2);
    });
  });

  describe('Pick Class', () => {
    it('should add an available class to picked classes and call service', () => {
      const cls = mockAvailableClasses[0];
      mockClassificationsService.addPickedClass.and.returnValue(of(null));
      
      component.pickClass(cls);

      expect(component.pickedClasses).toContain(jasmine.objectContaining(cls));
      expect(component.availableClasses).not.toContain(jasmine.objectContaining(cls));
      expect(mockClassificationsService.addPickedClass).toHaveBeenCalledWith(cls.id);
      expect(mockToastService.success).toHaveBeenCalledWith(`"${cls.name}" added successfully.`);
      expect(component.isSaving).toBeFalse();
    });

    it('should revert state if adding picked class fails', () => {
      const cls = mockAvailableClasses[0];
      mockClassificationsService.addPickedClass.and.returnValue(throwError(() => new Error('Error')));
      
      component.pickClass(cls);

      expect(component.pickedClasses).not.toContain(jasmine.objectContaining(cls));
      expect(component.availableClasses).toContain(jasmine.objectContaining(cls));
      expect(mockToastService.error).toHaveBeenCalledWith(`Failed to add "${cls.name}".`);
      expect(component.isSaving).toBeFalse();
    });

    it('should not do anything if class is already picked or saving', () => {
      component.isSaving = true;
      const cls = mockAvailableClasses[0];
      component.pickClass(cls);
      expect(mockClassificationsService.addPickedClass).not.toHaveBeenCalled();
    });
  });

  describe('Remove Pick Class', () => {
    it('should remove a picked class and call service', () => {
      const cls = mockPickedClasses[0];
      mockClassificationsService.deleteMessageClass.and.returnValue(of({ message: 'Removed', success: true }));
      
      component.removePickedClass(cls);

      expect(component.pickedClasses).not.toContain(jasmine.objectContaining(cls));
      expect(component.availableClasses).toContain(jasmine.objectContaining(cls));
      expect(mockClassificationsService.deleteMessageClass).toHaveBeenCalledWith(cls.id);
      expect(mockToastService.success).toHaveBeenCalledWith('Removed');
      expect(component.isSaving).toBeFalse();
    });

    it('should revert state if removing picked class fails', () => {
      const cls = mockPickedClasses[0];
      mockClassificationsService.deleteMessageClass.and.returnValue(throwError(() => new Error('Error')));
      
      component.removePickedClass(cls);

      expect(component.pickedClasses).toContain(jasmine.objectContaining(cls));
      expect(component.availableClasses).not.toContain(jasmine.objectContaining(cls));
      expect(mockToastService.error).toHaveBeenCalledWith(`Failed to remove "${cls.name}".`);
      expect(component.isSaving).toBeFalse();
    });
  });

  describe('Add Custom Class', () => {
    it('should add a custom class and call service', () => {
      component.customInput = 'New Class';
      mockClassificationsService.addCustomClass.and.returnValue(of({ message: 'Added', success: true }));
      
      component.addCustomClass();

      expect(component.customClasses.length).toBe(2);
      expect(component.customClasses[1].name).toBe('New Class');
      expect(component.customInput).toBe('');
      expect(mockClassificationsService.addCustomClass).toHaveBeenCalledWith('New Class');
      expect(mockToastService.success).toHaveBeenCalledWith('Added');
      expect(component.isSaving).toBeFalse();
    });

    it('should show error if custom class already exists', () => {
      component.customInput = 'Refund';
      component.addCustomClass();
      expect(mockToastService.error).toHaveBeenCalledWith('This custom class already exists.');
      expect(component.customInput).toBe('');
    });

    it('should pick system class if custom input matches an available class', () => {
      component.customInput = 'General'; 
      spyOn(component, 'pickClass');
      
      component.addCustomClass();
      
      expect(component.pickClass).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'General' }));
      expect(component.customInput).toBe('');
    });

    it('should revert state if adding custom class fails', () => {
      component.customInput = 'New Class';
      mockClassificationsService.addCustomClass.and.returnValue(throwError(() => new Error('Error')));
      
      component.addCustomClass();

      expect(component.customClasses.length).toBe(1);
      expect(mockToastService.error).toHaveBeenCalledWith('Failed to add "New Class".');
      expect(component.isSaving).toBeFalse();
    });
  });

  describe('Remove Custom Class', () => {
    it('should remove custom class and call service', () => {
      const cls = mockCustomClasses[0];
      mockClassificationsService.deleteMessageClass.and.returnValue(of({ message: 'Deleted', success: true }));
      
      component.removeCustomClass(cls);

      expect(component.customClasses).not.toContain(jasmine.objectContaining(cls));
      expect(mockClassificationsService.deleteMessageClass).toHaveBeenCalledWith(cls.id);
      expect(mockToastService.success).toHaveBeenCalledWith('Deleted');
      expect(component.isSaving).toBeFalse();
    });

    it('should revert state if removing custom class fails', () => {
      const cls = mockCustomClasses[0];
      mockClassificationsService.deleteMessageClass.and.returnValue(throwError(() => new Error('Error')));
      
      component.removeCustomClass(cls);

      expect(component.customClasses).toContain(jasmine.objectContaining(cls));
      expect(mockToastService.error).toHaveBeenCalledWith(`Failed to delete "${cls.name}".`);
      expect(component.isSaving).toBeFalse();
    });
  });
});
