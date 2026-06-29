import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexDataLabels,
} from 'ng-apexcharts';
import { ContentGapItem } from '../../../../../models/analytics.model';

@Component({
  selector: 'app-analytics-content-gaps',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './analytics-content-gaps.component.html',
  styleUrl: './analytics-content-gaps.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AnalyticsContentGapsComponent implements OnChanges {
  @Input({ required: true }) generatedAtHistory: string[] = [];
  @Input({ required: true }) contentGapCountHistory: number[] = [];
  @Input() gapDetail: ContentGapItem[] | null = null;
  @Input() selectedTimestamp: string | null = null;
  @Input() isLoadingDetail = false;
  @Input() hasDetailError = false;

  @Output() pointClicked = new EventEmitter<string>();
  @Output() closeDetail = new EventEmitter<void>();
  @Output() retryDetail = new EventEmitter<void>();

  series: ApexAxisChartSeries = [];

  chartOptions: ApexChart = {
    type: 'line',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    events: {
      dataPointSelection: (
        _event,
        _ctx,
        config: { dataPointIndex: number },
      ) => {
        this.zone.run(() => {
          const index = config?.dataPointIndex;
          if (index == null || index < 0) return;
          this.handleChartPointClick(index);
        });
      },
      markerClick: (_event, _ctx, config: { dataPointIndex: number }) => {
        this.zone.run(() => {
          const index = config?.dataPointIndex;
          if (index != null && index >= 0) this.handleChartPointClick(index);
        });
      },
    },
  };

  stroke: ApexStroke = {
    curve: 'smooth',
    width: 3,
    colors: ['var(--primary)'],
  };
  markers: ApexMarkers = {
    size: 6,
    strokeColors: 'var(--primary)',
    strokeWidth: 2,
    hover: { size: 8, sizeOffset: 3 },
  };
  dataLabels: ApexDataLabels = { enabled: false };
  xaxis: ApexXAxis = { categories: [] };
  yaxis: ApexYAxis = {};
  grid: ApexGrid = { strokeDashArray: 4 };
  tooltip: ApexTooltip = {
    theme: 'dark',
    y: { formatter: (val: number) => `${val} content gaps` },
  };
  colors: string[] = ['var(--primary)'];

  selectedChronologicalIndex: number | null = null;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['generatedAtHistory'] || changes['contentGapCountHistory']) {
      this.buildTrendChart();
    }
  }

  gapItemTopic(item: ContentGapItem) {
    return (
      (item['topic'] as string) ??
      (item['cluster'] as string) ??
      'Untitled topic'
    );
  }

  gapItemFrequency(item: ContentGapItem) {
    return (item['frequency'] as number) ?? (item['count'] as number) ?? 0;
  }

  onCloseDetail() {
    this.selectedChronologicalIndex = null;
    this.closeDetail.emit();
  }

  buildTrendChart() {
    if (
      !this.generatedAtHistory?.length ||
      !this.contentGapCountHistory?.length
    ) {
      this.series = [];
      return;
    }

    const points = this.generatedAtHistory
      .map((ts, i) => ({
        timestamp: ts,
        count: this.contentGapCountHistory[i] ?? 0,
      }))
      .slice()
      .reverse();

    this.series = [{ name: 'Content gaps', data: points.map((p) => p.count) }];
    this.xaxis = {
      ...this.xaxis,
      categories: points.map((p) =>
        new Date(p.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      ),
    };
  }

  handleChartPointClick(chronologicalIndex: number) {
    const history = this.generatedAtHistory;
    if (!history?.length) return;

    const reversedIndex = history.length - 1 - chronologicalIndex;
    const timestamp = history[reversedIndex];
    if (!timestamp) return;

    this.selectedChronologicalIndex = chronologicalIndex;
    this.pointClicked.emit(timestamp);
  }
}
