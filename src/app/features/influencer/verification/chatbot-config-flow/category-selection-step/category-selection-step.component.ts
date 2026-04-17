import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { ChatbotCategoryService } from '../../../../chatbot/services/chatbot-category.service';
import { ChatbotCategory } from '../../../../chatbot/models/chatbot-category.model';

@Component({
  selector: 'app-category-selection-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category-selection-step.component.html',
  styleUrl: './category-selection-step.component.css',
})
export class CategorySelectionStepComponent implements OnInit {
  @Input() selectedCategory: number | null = null;
  @Output() categorySubmit = new EventEmitter<ChatbotCategory>();
  @Output() back = new EventEmitter<void>();

  currentSelection: number | null = null;
  categories: ChatbotCategory[] = [];

  constructor(private categoryService: ChatbotCategoryService) {}

  ngOnInit() {
    this.currentSelection = this.selectedCategory;

    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      }
    });
  }

  onSelectChange(value: string) {
    this.currentSelection = Number(value);
  }

  onContinue() {
    if (!this.currentSelection) return;

    const selected = this.categories.find(
      (c) => c.id === this.currentSelection,
    );

    if (selected) {
      this.categorySubmit.emit(selected);
    }
  }

  onBack() {
    this.back.emit();
  }
}
