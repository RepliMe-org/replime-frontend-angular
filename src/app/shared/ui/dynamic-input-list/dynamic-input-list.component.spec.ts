import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicInputListComponent } from './dynamic-input-list.component';

describe('DynamicInputListComponent', () => {
  let component: DynamicInputListComponent;
  let fixture: ComponentFixture<DynamicInputListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInputListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInputListComponent);
    component = fixture.componentInstance;
  });

  function init(items = [{ localId: 1, value: 'Angular' }]) {
    component.items = [...items];
    fixture.detectChanges();
  }

  it('should create', () => {
    init();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize controls from items', () => {
      init([
        { localId: 1, value: 'Angular' },
        { localId: 2, value: 'React' },
      ]);

      expect(component.formArray.length).toBe(2);
      expect(component.formArray.at(0).value).toBe('Angular');
      expect(component.formArray.at(1).value).toBe('React');
    });

    it('should add one empty item when no items exist', () => {
      spyOn(component.hasEmptyItems, 'emit');

      init([]);

      expect(component.formArray.length).toBe(1);
      expect(component.items.length).toBe(1);
      expect(component.hasEmptyItems.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('ngOnChanges()', () => {
    it('should mark all controls as touched when triggerValidation becomes true', () => {
      init();

      component.ngOnChanges({
        triggerValidation: {
          previousValue: false,
          currentValue: true,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.formArray.at(0).touched).toBeTrue();
    });
  });

  describe('createControl()', () => {
    it('should create a required control', () => {
      init();

      const control = component.createControl('');

      expect(control.invalid).toBeTrue();

      control.setValue('Angular');

      expect(control.valid).toBeTrue();
    });
  });

  describe('form value changes', () => {
    it('should emit updated items', () => {
      init();

      spyOn(component.itemsChange, 'emit');
      spyOn(component.valueChanged, 'emit');
      spyOn(component.hasEmptyItems, 'emit');

      component.formArray.at(0).setValue('Updated');

      expect(component.itemsChange.emit).toHaveBeenCalledWith([
        {
          localId: 1,
          value: 'Updated',
        },
      ]);

      expect(component.valueChanged.emit).toHaveBeenCalled();
      expect(component.hasEmptyItems.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('addItem()', () => {
    it('should add a new empty item', () => {
      init();

      spyOn(component.hasEmptyItems, 'emit');

      component.addItem();

      expect(component.formArray.length).toBe(2);
      expect(component.items.length).toBe(2);
      expect(component.items[1].value).toBe('');
      expect(component.hasEmptyItems.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('removeItem()', () => {
    it('should remove an item when multiple exist', () => {
      init([
        { localId: 1, value: 'Angular' },
        { localId: 2, value: 'React' },
      ]);

      spyOn(component.itemsChange, 'emit');
      spyOn(component.hasEmptyItems, 'emit');

      component.removeItem(0);

      expect(component.formArray.length).toBe(1);
      expect(component.items.length).toBe(1);
      expect(component.items[0].value).toBe('React');

      expect(component.itemsChange.emit).toHaveBeenCalledWith([
        {
          localId: 2,
          value: 'React',
        },
      ]);

      expect(component.hasEmptyItems.emit).toHaveBeenCalled();
    });

    it('should reset the only remaining control instead of removing it', () => {
      init();

      spyOn(component.hasEmptyItems, 'emit');

      component.removeItem(0);

      expect(component.formArray.length).toBe(1);
      expect(component.formArray.at(0).value).toBe('');
      expect(component.formArray.at(0).touched).toBeTrue();
      expect(component.hasEmptyItems.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('isControlInvalid()', () => {
    it('should return true for touched invalid control', () => {
      init();

      component.formArray.at(0).setValue('');
      component.formArray.at(0).markAsTouched();

      expect(component.isControlInvalid(0)).toBeTrue();
    });

    it('should return false for valid control', () => {
      init();

      expect(component.isControlInvalid(0)).toBeFalse();
    });
  });

  describe('shouldShowDuplicateError()', () => {
    it('should return true when duplicate exists', () => {
      init();

      component.duplicateItemFlags = [true];
      component.existingItemFlags = [false];

      expect(component.shouldShowDuplicateError(0)).toBeTrue();
    });

    it('should return false when control is invalid', () => {
      init();

      component.formArray.at(0).setValue('');
      component.formArray.at(0).markAsTouched();

      component.duplicateItemFlags = [true];
      component.existingItemFlags = [false];

      expect(component.shouldShowDuplicateError(0)).toBeFalse();
    });

    it('should return false when existing flag is true', () => {
      init();

      component.duplicateItemFlags = [true];
      component.existingItemFlags = [true];

      expect(component.shouldShowDuplicateError(0)).toBeFalse();
    });
  });

  describe('shouldShowExistingError()', () => {
    it('should return true when existing flag is true', () => {
      init();

      component.existingItemFlags = [true];

      expect(component.shouldShowExistingError(0)).toBeTrue();
    });

    it('should return false when control is invalid', () => {
      init();

      component.formArray.at(0).setValue('');
      component.formArray.at(0).markAsTouched();

      component.existingItemFlags = [true];

      expect(component.shouldShowExistingError(0)).toBeFalse();
    });

    it('should return false when existing flag is false', () => {
      init();

      component.existingItemFlags = [false];

      expect(component.shouldShowExistingError(0)).toBeFalse();
    });
  });
});
