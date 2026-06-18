import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { ChatbotCategory } from '../../../../core/models/chatbot-category.model';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.css',
})
export class CategoriesSectionComponent {

  categories: ChatbotCategory[] = [];
  colors = [
  '#00d4e8',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#6366f1',
  '#ec4899',
  '#eab308',
  '#14b8a6',
];
  constructor( private chatbotCategoryService: ChatbotCategoryService) {}

  ngOnInit(){
    this.chatbotCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.slice(0, 8);
      },
    });
  }

}