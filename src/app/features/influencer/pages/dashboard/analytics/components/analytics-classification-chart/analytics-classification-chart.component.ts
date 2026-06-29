import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
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
  ApexPlotOptions,
  ApexDataLabels,
} from 'ng-apexcharts';
import { ClassificationCount } from '../../../../../models/analytics.model';

@Component({
  selector: 'app-analytics-classification-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './analytics-classification-chart.component.html',
  styleUrl: './analytics-classification-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsClassificationChartComponent implements OnChanges {
  @Input({ required: true }) breakdown: ClassificationCount[] = [];

  series: ApexAxisChartSeries = [];
  chartOptions: ApexChart = {
    type: 'bar',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
  };
  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '55%',
      distributed: true,
    },
  };
  dataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val}%`,
    style: { fontSize: '12px', fontWeight: 600 },
    offsetX: 8,
  };
  xaxis: ApexXAxis = {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  yaxis: ApexYAxis = {
    labels: { style: { fontSize: '13px' } },
  };
  grid: ApexGrid = {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  };
  tooltip: ApexTooltip = {
    theme: 'dark',
    y: { formatter: (val: number) => `${val} messages` },
  };
  colors: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['breakdown']) {
      this.buildChart();
      this.cdr.markForCheck();
    }
  }

  totalMessages() {
    if (!this.breakdown?.length) return 0;
    return this.breakdown.reduce((sum, d) => sum + d.count, 0);
  }

  buildChart() {
    if (!this.breakdown?.length) {
      this.series = [];
      return;
    }
    const sorted = [...this.breakdown].sort((a, b) => b.count - a.count);

    this.series = [
      { name: 'Share of messages', data: sorted.map((d) => d.percentage) },
    ];
    this.xaxis = {
      ...this.xaxis,
      categories: sorted.map((d) => d.messageClass),
    };
    this.colors = [
      'var(--chart-color-1)',
      'var(--chart-color-2)',
      'var(--chart-color-3)',
      'var(--chart-color-4)',
      'var(--chart-color-5)',
      'var(--chart-color-6)',
      'var(--chart-color-7)',
      'var(--chart-color-8)',
    ];
  }
}
