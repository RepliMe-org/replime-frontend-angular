import { Component, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../../../../shared/shared.module';
import { ToastService } from '../../../../../core/services/toast.service';
import { InfluencerClassificationsService } from '../../../services/influencer-classifications.service';
import { MessageClass } from '../../../../../core/models/chatbot-category.model';

@Component({
  selector: 'app-classifications',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './classifications.component.html',
  styleUrl: './classifications.component.css',
})
export class ClassificationsComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  categoryName: string = '';

  pickedClasses: MessageClass[] = [];
  customClasses: MessageClass[] = [];
  availableClasses: MessageClass[] = [];

  customInput = '';


  constructor(
    private classificationsService: InfluencerClassificationsService,
    private toast: ToastService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.loadClassifications();
  }

  loadClassifications() {
    this.isLoading = true;

    this.classificationsService.getMessageClasses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.categoryName = data.category?.name ?? '';
        this.pickedClasses = data.pickedClasses ?? [];
        this.customClasses = data.customClasses ?? [];
        this.availableClasses = data.availableClasses ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load classifications. Please refresh.');
        this.isLoading = false;
      },
    });

  }

  totalSelected(): number {
    return this.pickedClasses.length + this.customClasses.length;
  }

  pickClass(cls: MessageClass) {
    if (this.isClassPicked(cls) || this.isSaving) {
      return;
    }

    const previousPicked = [...this.pickedClasses];
    const previousAvailable = [...this.availableClasses];

    this.pickedClasses = [...this.pickedClasses, cls];

    this.availableClasses = this.availableClasses.filter(
      (c) => c.id !== cls.id,
    );

    this.isSaving = true;

    this.classificationsService.addPickedClass(cls.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success(`"${cls.name}" added successfully.`);
      },
      error: () => {
        this.pickedClasses = previousPicked;
        this.availableClasses = previousAvailable;
        this.isSaving = false;
        this.toast.error(`Failed to add "${cls.name}".`);
      },
    });
  }

  removePickedClass(cls: MessageClass) {
    if (this.isSaving) return;

    const previousPicked = [...this.pickedClasses];
    const previousAvailable = [...this.availableClasses];

    this.pickedClasses = this.pickedClasses.filter((c) => c.id !== cls.id);
    this.availableClasses = [...this.availableClasses, cls];

    this.isSaving = true;

    this.classificationsService.deleteMessageClass(cls.id).subscribe({
      next: (response) => {
        this.isSaving = false;

        this.toast.success(
          response.message || `"${cls.name}" removed successfully.`,
        );
      },

      error: () => {
        this.pickedClasses = previousPicked;
        this.availableClasses = previousAvailable;

        this.isSaving = false;

        this.toast.error(`Failed to remove "${cls.name}".`);
      },
    });
  }

  isClassPicked(cls: MessageClass): boolean {
    return this.pickedClasses.some((c) => c.id === cls.id);
  }

  addCustomClass() {
    const trimmed = this.customInput.trim().replace(/,$/, '');

    if (!trimmed || this.isSaving) {
      return;
    }

    const alreadyCustom = this.customClasses.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyCustom) {
      this.toast.error('This custom class already exists.');
      this.customInput = '';
      return;
    }

    const systemMatch = this.availableClasses.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (systemMatch) {
      this.pickClass(systemMatch);
      this.customInput = '';
      return;
    }

    const previousCustom = [...this.customClasses];

    const tempClass: MessageClass = {
      id: -Date.now(),
      name: trimmed,
    };

    this.customClasses = [...this.customClasses, tempClass];
    this.customInput = '';
    this.isSaving = true;

    this.classificationsService.addCustomClass(trimmed).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toast.success(
          response.message || `"${trimmed}" added successfully.`,
        );
      },
      error: () => {
        this.customClasses = previousCustom;
        this.isSaving = false;
        this.toast.error(`Failed to add "${trimmed}".`);
      },
    });
  }

  removeCustomClass(cls: MessageClass) {
    if (this.isSaving) return;

    const previousCustom = [...this.customClasses];
    this.customClasses = this.customClasses.filter((c) => c.id !== cls.id);
    this.isSaving = true;

    this.classificationsService.deleteMessageClass(cls.id).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toast.success( response.message || `"${cls.name}" deleted successfully.`);
      },
      error: () => {
        this.customClasses = previousCustom;
        this.isSaving = false;
        this.toast.error(`Failed to delete "${cls.name}".`);
      },
    });
  }

  onCustomKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addCustomClass();
    }
  }


  trackById(index: number, cls: MessageClass): number {
    return cls.id;
  }
}
