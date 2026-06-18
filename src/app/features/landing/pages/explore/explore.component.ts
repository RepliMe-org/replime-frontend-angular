import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicChatbotService } from '../../../../core/services/public-chatbot.service';
import { PublicChatbot } from '../../../../core/models/public-chatbot.model';
import { ChatbotCardComponent } from '../../components/chatbot-card/chatbot-card.component';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { SharedModule } from '../../../../shared/shared.module';
import { filterByQuery } from '../../../../shared/utils/filter.utils';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [SharedModule, ChatbotCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  chatbots: PublicChatbot[] = [];
  filtered: PublicChatbot[] = [];

  categories: { id: number; name: string }[] = [];

  searchQuery: string = '';
  selectedCategory: string = 'All';

  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private publicChatbotService: PublicChatbotService,
    private chatbotCategoryService: ChatbotCategoryService
  ) {}

  ngOnInit() {
    this.chatbotCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
    });

    this.publicChatbotService.getAllChatbots().subscribe({
      next: (data) => {
        this.chatbots = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load chatbots. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onSearch() {
    this.applyFilter();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilter();
  }

  applyFilter() {
    const categoryFiltered = this.selectedCategory === 'All' 
      ? this.chatbots 
      : this.chatbots.filter(c => c.categoryName === this.selectedCategory);

    this.filtered = filterByQuery(
      categoryFiltered,
      this.searchQuery,
      ['chatbotName', 'influencerUsername', 'channelHandle', 'chatbotDescription', 'categoryName']
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedCategory = 'All'
    this.applyFilter();
  }

  trackById(index: number, bot: PublicChatbot): string {
    return bot.id;
  }
}