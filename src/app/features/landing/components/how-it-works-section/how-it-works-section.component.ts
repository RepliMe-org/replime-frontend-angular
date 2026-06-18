import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works-section.component.html',
  styleUrl: './how-it-works-section.component.css',
})
export class HowItWorksSectionComponent {
  steps = [
    {
      number: '01',
      icon: 'fa-solid fa-play',
      title: 'Creator submits channel',
      description:
        'Connect your YouTube channel URL. We verify ownership and fetch your public content automatically.',
    },
    {
      number: '02',
      icon: 'fa-solid fa-bolt',
      title: 'AI processes content',
      description:
        'Our RAG pipeline transcribes, chunks, and indexes every video into a searchable knowledge base.',
    },
    {
      number: '03',
      icon: 'fa-solid fa-message',
      title: 'Fans chat instantly',
      description:
        'Fans ask questions and get answers grounded exclusively in the creator\'s own words and insights.',
    },
  ];
}