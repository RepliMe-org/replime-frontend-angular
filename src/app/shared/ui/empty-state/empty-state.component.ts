import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() iconClass: string = 'fa-solid fa-folder-open';
  @Input() title: string = 'No items found';
  @Input() description: string = 'There is nothing here yet.';
  @Input() isLoading: boolean = false;
  @Input() loadingMessage: string = 'Loading...';
}
