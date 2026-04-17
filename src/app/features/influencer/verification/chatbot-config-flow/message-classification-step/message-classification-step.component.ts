import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { SharedModule } from '../../../../../shared/shared.module';
import { ChatbotCategoryService } from '../../../../chatbot/services/chatbot-category.service';
import { ClassificationsOutput, MessageClass } from '../../models/classification.model';

@Component({
  selector: 'app-message-classification-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './message-classification-step.component.html',
  styleUrl: './message-classification-step.component.css',
})
export class MessageClassificationStepComponent implements OnInit, OnDestroy {
  @Input() selectedSystemIds: number[] = [];
  @Input() selectedCustomNames: string[] = [];
  @Input() category: number | null = null;
  @Output() classificationsSubmit = new EventEmitter<ClassificationsOutput>();
  @Output() back = new EventEmitter<void>();

  allSystemClasses: MessageClass[] = [];
  filteredSystemClasses: MessageClass[] = [];
  isLoadingClasses = false;

  selectedSystemClasses: MessageClass[] = [];
  customClasses: string[] = [];

  searchQuery = '';
  searchSubject = new Subject<string>();
  subscription = new Subscription();

  customClassInput = '';

  constructor(private chatbotCategoryService: ChatbotCategoryService) {}

  ngOnInit() {
    this.customClasses = [...(this.selectedCustomNames ?? [])];

    if (this.category !== null) {
      this.loadSystemClassifications();
    }

    const searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.filterClasses(query);
      });

    this.subscription.add(searchSub);
  }

  loadSystemClassifications() {
    this.isLoadingClasses = true;

    const loadSub = this.chatbotCategoryService
      .getMessageClasses(this.category!.toString())
      .subscribe({
        next: (classes) => {
          this.allSystemClasses = Array.isArray(classes)
            ? (classes as MessageClass[])
            : [];
          this.filteredSystemClasses = [...this.allSystemClasses];

          if (this.selectedSystemIds?.length) {
            this.selectedSystemClasses = this.allSystemClasses.filter((c) =>
              this.selectedSystemIds.includes(c.id),
            );
          }

          this.isLoadingClasses = false;
        },
        error: () => {
          this.isLoadingClasses = false;
        },
      });

    this.subscription.add(loadSub);
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  filterClasses(query: string) {
    const lower = query.trim().toLowerCase();
    this.filteredSystemClasses = !lower
      ? [...this.allSystemClasses]
      : this.allSystemClasses.filter((c) =>
          c.name.toLowerCase().includes(lower),
        );
  }

  isSystemSelected(cls: MessageClass): boolean {
    return this.selectedSystemClasses.some((c) => c.id === cls.id);
  }

  toggleSystemClass(cls: MessageClass) {
    if (this.isSystemSelected(cls)) {
      this.selectedSystemClasses = this.selectedSystemClasses.filter(
        (c) => c.id !== cls.id,
      );
    } else {
      this.selectedSystemClasses = [...this.selectedSystemClasses, cls];
    }
  }

  onCustomKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addCustomClass();
    }
  }

  addCustomClass() {
    const trimmed = this.customClassInput.trim().replace(/,$/, '');
    if (!trimmed) return;

    const existsInCustom = this.customClasses.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase(),
    );
    const existsInSystem = this.allSystemClasses.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (existsInCustom) {
      this.customClassInput = '';
      return;
    }

    if (existsInSystem) {
      const systemMatch = this.allSystemClasses.find(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
      )!;
      if (!this.isSystemSelected(systemMatch)) {
        this.selectedSystemClasses = [
          ...this.selectedSystemClasses,
          systemMatch,
        ];
      }
    } else {
      this.customClasses = [...this.customClasses, trimmed];
    }

    this.customClassInput = '';
  }

  removeSystemClass(cls: MessageClass) {
    this.selectedSystemClasses = this.selectedSystemClasses.filter(
      (c) => c.id !== cls.id,
    );
  }

  removeCustomClass(name: string) {
    this.customClasses = this.customClasses.filter((c) => c !== name);
  }

  totalSelected(): number {
    return this.selectedSystemClasses.length + this.customClasses.length;
  }

  onContinue() {
  if (this.totalSelected() === 0) return;
  this.classificationsSubmit.emit({
    systemClassIds: this.selectedSystemClasses.map(c => c.id),
    systemClassNames: this.selectedSystemClasses.map(c => c.name),
    customClassNames: [...this.customClasses],
  });
}

  onBack() {
    this.back.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
