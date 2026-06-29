import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-report-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-report-history.component.html',
  styleUrl: './analytics-report-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsReportHistoryComponent {
  @Input({ required: true }) history: string[] = [];
  @Input({ required: true }) activeIndex = 0;
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output() reportSelected = new EventEmitter<number>();

  isLatestEntry(index: number) {
    return index === 0;
  }

  select(index: number) {
    if (index === this.activeIndex || this.isLoading) return;
    this.reportSelected.emit(index);
  }
}
