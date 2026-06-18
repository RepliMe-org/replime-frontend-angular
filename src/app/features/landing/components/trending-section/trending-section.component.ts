import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicChatbotService } from '../../../../core/services/public-chatbot.service';
import { PublicChatbot } from '../../../../core/models/public-chatbot.model';

@Component({
  selector: 'app-trending-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trending-section.component.html',
  styleUrl: './trending-section.component.css',
})
export class TrendingSectionComponent implements OnInit {
  chatbots: PublicChatbot[] = [];
  isLoading = true;
  hasError = false;

  constructor(private chatbotService: PublicChatbotService) {}

  ngOnInit(): void {
    this.chatbotService.getAllChatbots().subscribe({
      next: (chatbots) => {
        this.chatbots = chatbots
          .filter((c) => c.status === 'ACTIVE')
          .slice(0, 4);
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  trackById(_: number, chatbot: PublicChatbot): string {
    return chatbot.id;
  }
}