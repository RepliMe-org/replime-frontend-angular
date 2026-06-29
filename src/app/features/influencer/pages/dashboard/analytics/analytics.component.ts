import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { AnalyticsService } from '../../../services/analytics.service';
import {
  AnalyticsReportResponseDTO,
  ContentGapItem,
} from '../../../models/analytics.model';
import { AnalyticsReportHistoryComponent } from './components/analytics-report-history/analytics-report-history.component';
import { AnalyticsClassificationChartComponent } from './components/analytics-classification-chart/analytics-classification-chart.component';
import { AnalyticsClustersComponent } from './components/analytics-clusters/analytics-clusters.component';
import { AnalyticsContentGapsComponent } from './components/analytics-content-gaps/analytics-content-gaps.component';
import { AnalyticsCitedVideosComponent } from './components/analytics-cited-videos/analytics-cited-videos.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    AnalyticsReportHistoryComponent,
    AnalyticsClassificationChartComponent,
    AnalyticsClustersComponent,
    AnalyticsContentGapsComponent,
    AnalyticsCitedVideosComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  isLoading = true;
  isRegenerating = false;
  loadError = false;
  analysis: AnalyticsReportResponseDTO | null = null;

  activeHistoryIndex = 0;
  isLoadingHistoryReport = false;
  historyReportError = false;

  cooldownSecondsRemaining = 0;

  selectedGapTimestamp: string | null = null;
  selectedGapIndex: number | null = null;
  gapDetail: ContentGapItem[] | null = null;
  isLoadingGapDetail = false;
  gapDetailError = false;

  private latestSub?: Subscription;
  private historySub?: Subscription;
  private regenerateSub?: Subscription;
  private detailSub?: Subscription;
  private cooldownSub?: Subscription;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadLatest();
  }

  loadAnalysis() {
    this.loadLatest();
  }

  regenerate() {
    if (this.isRegenerating || this.cooldownSecondsRemaining > 0) return;
    this.isRegenerating = true;

    this.regenerateSub = this.analyticsService.regenerateReport().subscribe({
      next: (data) => {
        this.isRegenerating = false;
        this.applyReport(data, true);
      },
      error: (err: HttpErrorResponse) => {
        this.isRegenerating = false;
        if (err.status === 429) {
          const nextAvailableAt = err.error?.nextAvailableAt;
          if (nextAvailableAt) this.startCooldown(nextAvailableAt);
        }
      },
    });
  }

  onReportSelected(index: number) {
    const history = this.analysis?.generatedAtHistory;
    if (!history?.[index] || index === this.activeHistoryIndex) return;

    const timestamp = history[index];
    this.isLoadingHistoryReport = true;
    this.historyReportError = false;
    this.historySub?.unsubscribe();

    this.historySub = this.analyticsService
      .getReportByTimestamp(timestamp)
      .subscribe({
        next: (data) => {
          this.isLoadingHistoryReport = false;
          this.analysis = data;
          this.activeHistoryIndex = index;
        },
        error: () => {
          this.isLoadingHistoryReport = false;
          this.historyReportError = true;
        },
      });
  }

  onGapPointClicked(timestamp: string) {
    const history = this.analysis?.generatedAtHistory;
    if (!history?.length) return;

    const reversedIndex = history.indexOf(timestamp);
    const chronologicalIndex =
      reversedIndex >= 0 ? history.length - 1 - reversedIndex : 0;
    this.selectGapPoint(timestamp, chronologicalIndex);
  }

  onGapDetailClose() {
    this.clearGapSelection();
  }

  onGapDetailRetry() {
    if (this.selectedGapTimestamp != null && this.selectedGapIndex != null) {
      this.selectGapPoint(this.selectedGapTimestamp, this.selectedGapIndex);
    }
  }

  loadLatest() {
    this.isLoading = true;
    this.loadError = false;

    this.latestSub = this.analyticsService.getLatestReport().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.applyReport(data, true);
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
      },
    });
  }

  applyReport(
    data: AnalyticsReportResponseDTO,
    resetHistorySelection: boolean,
  ) {
    this.analysis = data;
    if (resetHistorySelection) {
      this.activeHistoryIndex = this.findHistoryIndex(
        data.generatedAt,
        data.generatedAtHistory,
      );
      this.clearGapSelection();
    }
  }

  findHistoryIndex(generatedAt: string, history: string[]) {
    if (!history?.length) return 0;
    const target = Date.parse(generatedAt);
    const idx = history.findIndex((ts) => Date.parse(ts) === target);
    return idx >= 0 ? idx : 0;
  }

  selectGapPoint(timestamp: string, chronologicalIndex: number) {
    this.selectedGapTimestamp = timestamp;
    this.selectedGapIndex = chronologicalIndex;
    this.gapDetail = null;
    this.gapDetailError = false;
    this.isLoadingGapDetail = true;
    this.detailSub?.unsubscribe();

    this.detailSub = this.analyticsService.getContentGaps(timestamp).subscribe({
      next: (res) => {
        this.gapDetail = res.contentGaps ?? [];
        this.isLoadingGapDetail = false;
      },
      error: () => {
        this.gapDetailError = true;
        this.isLoadingGapDetail = false;
      },
    });
  }

  clearGapSelection() {
    this.selectedGapTimestamp = null;
    this.selectedGapIndex = null;
    this.gapDetail = null;
    this.gapDetailError = false;
    this.detailSub?.unsubscribe();
  }

  startCooldown(nextAvailableAt: string) {
    this.cooldownSub?.unsubscribe();

    const tick = () => {
      const remainingMs = new Date(nextAvailableAt).getTime() - Date.now();
      this.cooldownSecondsRemaining = Math.max(
        0,
        Math.ceil(remainingMs / 1000),
      );
      return this.cooldownSecondsRemaining;
    };

    if (tick() <= 0) return;

    this.cooldownSub = timer(0, 1000).subscribe(() => {
      if (tick() <= 0) this.cooldownSub?.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.latestSub?.unsubscribe();
    this.historySub?.unsubscribe();
    this.regenerateSub?.unsubscribe();
    this.detailSub?.unsubscribe();
    this.cooldownSub?.unsubscribe();
  }
}
