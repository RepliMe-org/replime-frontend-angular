import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent {
  @Input() iconClass: string = 'fa-solid fa-folder-open';
  @Input() title: string = 'No items found';
  @Input() description: string = 'There is nothing here yet.';
  @Input() isLoading: boolean = false;
  @Input() loadingMessage: string = 'Loading...';
}
