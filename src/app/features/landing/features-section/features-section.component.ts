import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.css',
})
export class FeaturesSectionComponent {
  features = [
    {
      title: 'Natural Conversations',
      description: 'Chat naturally with AI versions of your favorite creators. Ask questions, get advice, and learn from their content.',
      icon: 'fa-comment',
    },
    {
      title: 'Content-Trained AI',
      description: "Each chatbot is trained exclusively on the creator's public content, ensuring authentic and accurate responses.",
      icon: 'fa-robot',
    },
    {
      title: 'Verified Creators',
      description: 'All creator chatbots are verified through channel ownership, preventing impersonation and ensuring authenticity.',
      icon: 'fa-shield',
    },
    {
      title: 'Creator Analytics',
      description: 'Creators get insights into audience interests, popular questions, and trending topics to inform future content.',
      icon: 'fa-chart-line',
    },
    {
      title: 'Instant Responses',
      description: 'Get immediate answers without waiting for videos or streams. Access creator knowledge 24/7.',
      icon: 'fa-bolt',
    },
    {
      title: 'Community Engagement',
      description: 'Build deeper connections between creators and their audiences through personalized interactions.',
      icon: 'fa-users',
    },
  ];
}
