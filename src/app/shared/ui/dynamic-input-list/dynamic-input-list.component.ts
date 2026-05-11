import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputListItem } from './dynamic-input-list.model';

@Component({
  selector: 'app-dynamic-input-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-input-list.component.html',
  styleUrls: ['./dynamic-input-list.component.css'],
})
export class DynamicInputListComponent implements OnInit, OnChanges {
  @Input() items: InputListItem[] = [];
  @Input() placeholder = 'Enter value';
  @Input() duplicateItemFlags: boolean[] = [];
  @Input() existingItemFlags: boolean[] = [];
  @Input() existingItemMessage = 'Already exists';
  @Input() triggerValidation = false;

  @Output() itemsChange = new EventEmitter<InputListItem[]>();
  @Output() valueChanged = new EventEmitter<void>();
  @Output() hasEmptyItems = new EventEmitter<boolean>();

  nextItemId = 0;

  formArray: FormArray<FormControl<string>>;

  constructor(private formBuilder: FormBuilder) {
    this.formArray = this.formBuilder.array<FormControl<string>>([]);
  }

  ngOnInit() {
    this.initializeForm();
    this.listenToFormChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerValidation']?.currentValue) {
      this.formArray.markAllAsTouched();
    }
  }

  initializeForm() {
    this.formArray.clear();

    this.items.forEach((item) => {
      this.formArray.push(this.createControl(item.value));
    });

    if (!this.formArray.length) {
      this.addItem();
    }
  }

  createControl(value: string): FormControl<string> {
    return this.formBuilder.nonNullable.control(value, Validators.required);
  }

  listenToFormChanges() {
    this.formArray.valueChanges.subscribe((values) => {
      const updatedItems = values.map((value, index) => ({
        localId: this.items[index]?.localId ?? ++this.nextItemId,
        value,
      }));

      this.itemsChange.emit(updatedItems);
      this.valueChanged.emit();
      this.hasEmptyItems.emit(this.formArray.invalid);
    });
  }

  addItem() {
    this.formArray.push(this.createControl(''));

    this.items.push({
      localId: ++this.nextItemId,
      value: '',
    });

    this.hasEmptyItems.emit(true);
  }

  removeItem(index: number) {
    if (this.formArray.length === 1) {
      this.formArray.at(0).reset('');
      this.formArray.at(0).markAsTouched();
      this.hasEmptyItems.emit(true);
      return;
    }

    this.formArray.removeAt(index);
    this.items.splice(index, 1);
    this.itemsChange.emit([...this.items]);
    this.hasEmptyItems.emit(this.formArray.invalid);
  }

  isControlInvalid(index: number) {
    const control = this.formArray.at(index);
    return control.invalid && control.touched;
  }

  shouldShowDuplicateError(index: number) {
    return (
      this.duplicateItemFlags[index] &&
      !this.isControlInvalid(index) &&
      !this.existingItemFlags[index]
    );
  }

  shouldShowExistingError(index: number) {
    return this.existingItemFlags[index] && !this.isControlInvalid(index);
  }
}
