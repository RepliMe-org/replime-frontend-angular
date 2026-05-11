import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicChatbotService } from '../../../../core/services/public-chatbot.service';
import { PublicChatbot } from '../../../../core/models/public-chatbot.model';
import { ChatbotCardComponent } from '../../components/chatbot-card/chatbot-card.component';
import { ChatbotCategoryService } from '../../../../core/services/chatbot-category.service';
import { SharedModule } from '../../../../shared/shared.module';

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
    private ChatbotCategoryService: ChatbotCategoryService
  ) {}

  ngOnInit() {
    this.ChatbotCategoryService.getCategories().subscribe({
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
    const q = this.searchQuery.toLowerCase().trim();

    this.filtered = this.chatbots.filter((c) => {
      const matchesSearch =
        !q ||
        c.chatbotName.toLowerCase().includes(q) ||
        c.influencerUsername.toLowerCase().includes(q) ||
        c.channelHandle?.toLowerCase().includes(q) ||
        c.chatbotDescription.toLowerCase().includes(q) ||
        c.categoryName.toLowerCase().includes(q);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        c.categoryName === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedCategory = 'All'
    this.applyFilter();
  }
}