import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from '../../../../shared/ui/search-input/search-input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-chatbot-filters',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, ButtonComponent, CardComponent],
  templateUrl: './chatbot-filters.component.html',
  styleUrls: ['./chatbot-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotFiltersComponent {
  @Input() searchQuery = '';
  @Input() activeFilter: 'All' | 'Active' | 'Training' | 'Failed' = 'All';

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<'All' | 'Active' | 'Training' | 'Failed'>();

  setFilter(filter: 'All' | 'Active' | 'Training' | 'Failed') {
    this.filterChange.emit(filter);
  }
}
