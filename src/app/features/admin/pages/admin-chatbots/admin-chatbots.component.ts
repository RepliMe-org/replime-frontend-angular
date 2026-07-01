import { Component, OnInit, inject } from '@angular/core';
import { ChatbotAdminService } from '../../services/chatbot-admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AdminChatbot } from '../../models/admin-chatbot';
import { ChatbotFiltersComponent } from '../../components/chatbot-filters/chatbot-filters.component';
import { ChatbotStatsComponent } from '../../components/chatbot-stats/chatbot-stats.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AdminChatbotCardComponent } from '../../components/admin-chatbot-card/admin-chatbot-card.component';
import { filterByQuery } from '../../../../shared/utils/filter.utils';

@Component({
  selector: 'app-admin-chatbots',
  standalone: true,
  imports: [
    SharedModule,
    AdminChatbotCardComponent,
    ChatbotFiltersComponent,
    ChatbotStatsComponent,
  ],
  templateUrl: './admin-chatbots.component.html',
  styleUrls: ['./admin-chatbots.component.css'],
})
export class AdminChatbotsComponent implements OnInit {
  
  chatbots: AdminChatbot[] = [];
  filteredChatbots: AdminChatbot[] = [];

  loading = true;

  searchQuery = '';

  activeFilter: 'All' | 'Active' | 'Training' | 'Failed' = 'All';

  totalChatbots = 0;
  activeChatbots = 0;
  pendingChatbots = 0;
  failedChatbots = 0;

  showDeleteModal = false;
  botPendingDelete: AdminChatbot | null = null;
  deleteInProgress = false;

  constructor(private chatbotAdminService: ChatbotAdminService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadChatbots();
  }

  loadChatbots(): void {
    this.loading = true;
    this.chatbotAdminService.getAllChatbots().subscribe({
      next: (res: AdminChatbot[]) => {
        this.chatbots = res;
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.chatbots = [];
        this.calculateStats();
        this.applyFilters();
        this.toastService.error('Failed to load chatbots');
      },
    });
  }

  calculateStats(): void {
    this.totalChatbots = this.chatbots.length;

    this.activeChatbots = this.chatbots.filter(
      (c) => c.status === 'ACTIVE',
    ).length;

    this.pendingChatbots = this.chatbots.filter(
      (c) => c.status === 'CONFIGURING' || c.status === 'TRAINING',
    ).length;

    this.failedChatbots = this.chatbots.filter(
      (c) => c.status === 'FAILED',
    ).length;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  setFilter(filter: 'All' | 'Active' | 'Training' | 'Failed'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.chatbots];

    if (this.activeFilter !== 'All') {
      filtered = filtered.filter((chatbot) => {
        const status = chatbot.status.toUpperCase();

        if (this.activeFilter === 'Active') {
          return status === 'ACTIVE';
        }

        if (this.activeFilter === 'Training') {
          return status === 'CONFIGURING' || status === 'TRAINING';
        }

        if (this.activeFilter === 'Failed') {
          return status === 'FAILED';
        }

        return true;
      });
    }

    this.filteredChatbots = filterByQuery(filtered, this.searchQuery, [
      'chatbotName',
      'influencerUsername',
      'chatbotCategory'
    ]);
  }

  toggleVisibility(bot: AdminChatbot): void {
    const newVisibility = !bot.isPublic;
    bot.isPublic = newVisibility;

    this.chatbotAdminService.updateVisibility(bot.id, newVisibility).subscribe({
      next: () => {
        this.toastService.success(`Chatbot visibility ${newVisibility ? 'enabled' : 'disabled'}`);
      },
      error: () => {
        bot.isPublic = !newVisibility;
        this.toastService.error('Failed to update chatbot visibility');
      },
    });
  }

  requestDelete(bot: AdminChatbot): void {
    this.botPendingDelete = bot;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.botPendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.botPendingDelete) {
      return;
    }

    const bot = this.botPendingDelete;
    this.deleteInProgress = true;

    this.chatbotAdminService.deleteChatbot(bot.id).subscribe({
      next: () => {
        this.chatbots = this.chatbots.filter((c) => c.id !== bot.id);
        this.calculateStats();
        this.applyFilters();
        this.toastService.success('Chatbot deleted successfully');
        this.deleteInProgress = false;
        this.showDeleteModal = false;
        this.botPendingDelete = null;
      },
      error: () => {
        this.toastService.error('Failed to delete chatbot');
        this.deleteInProgress = false;
        this.showDeleteModal = false;
        this.botPendingDelete = null;
      },
    });
  }

  trackById(index: number, bot: AdminChatbot): string {
    return bot.id;
  }
}
