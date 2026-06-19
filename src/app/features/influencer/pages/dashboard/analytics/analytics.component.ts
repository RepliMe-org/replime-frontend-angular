import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
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
  ApexStroke,
  ApexMarkers,
} from 'ng-apexcharts';
import { SharedModule } from '../../../../../shared/shared.module';


type ClassificationName =
  | 'CONTENT_QUESTION'
  | 'GREETING'
  | 'SMALL_TALK'
  | 'OUT_OF_SCOPE'
  | 'HARMFUL';

interface ClassificationBreakdown {
  name: ClassificationName;
  count: number;
  percent: number;
}

interface MostAskedCluster {
  theme: string;
  count: number;
  exampleQuestions: string[];
}

interface ContentGapPoint {
  topic: string;
  frequency: number;
  sampleQuestions: string[];
  timestamp: string;
}

interface ContentGapDetail {
  timestamp: string;
  topic: string;
  frequency: number;
  sampleQuestions: string[];
  summary?: string;
}

interface MostCitedVideo {
  youtubeVideoId: string;
  videoTitle: string;
  citationCount: number;
}

interface ChatbotAnalysis {
  generatedAt: string;
  classifications: ClassificationBreakdown[];
  mostAskedClusters: MostAskedCluster[];
  executiveSummary: string;
  contentGaps: ContentGapPoint[];
  mostCitedVideos: MostCitedVideo[];
}


const USE_REAL_API = false;

const MOCK_ANALYSIS: ChatbotAnalysis = {
  generatedAt: '2026-06-15T09:30:00.000Z',
  classifications: [
    { name: 'CONTENT_QUESTION', count: 312, percent: 38 },
    { name: 'GREETING', count: 245, percent: 30 },
    { name: 'SMALL_TALK', count: 168, percent: 20 },
    { name: 'OUT_OF_SCOPE', count: 75, percent: 9 },
    { name: 'HARMFUL', count: 24, percent: 3 },
  ],
  mostAskedClusters: [
  {
    theme: 'Angular Development',
    count: 52,
    exampleQuestions: [
      'What is the difference between Signals and RxJS?',
      'How do I implement lazy loading in Angular?',
      'When should I use standalone components?',
    ],
  },
  {
    theme: 'JavaScript & TypeScript',
    count: 38,
    exampleQuestions: [
      'What is the difference between var, let, and const?',
      'How does the event loop work?',
      'What are TypeScript generics?',
    ],
  },
  {
    theme: 'Backend Development',
    count: 27,
    exampleQuestions: [
      'What is dependency injection in Spring Boot?',
      'How do I secure APIs using JWT?',
      'What is the difference between REST and GraphQL?',
    ],
  },
],

executiveSummary:
  'Your audience is primarily interested in web development topics, with Angular, TypeScript, and backend architecture generating the highest engagement. A recurring content gap exists around system design, performance optimization, and cloud deployment, which are frequently asked but not sufficiently covered.',

contentGaps: [
  {
    topic: 'System Design Fundamentals',
    frequency: 21,
    timestamp: '2026-03-01T00:00:00.000Z',
    sampleQuestions: [
      'How do I design a scalable chat application?',
      'What is load balancing?',
      'When should I use microservices?',
    ],
  },
  {
    topic: 'Performance Optimization',
    frequency: 17,
    timestamp: '2026-04-01T00:00:00.000Z',
    sampleQuestions: [
      'How can I reduce Angular bundle size?',
      'What causes memory leaks in JavaScript?',
      'How do I optimize API response times?',
    ],
  },
  {
    topic: 'Docker & Kubernetes',
    frequency: 13,
    timestamp: '2026-05-01T00:00:00.000Z',
    sampleQuestions: [
      'What is the difference between Docker and Kubernetes?',
      'How do I deploy a containerized application?',
      'What is a Kubernetes Pod?',
    ],
  },
  {
    topic: 'Cloud Deployment',
    frequency: 19,
    timestamp: '2026-06-01T00:00:00.000Z',
    sampleQuestions: [
      'How do I deploy an Angular app to AWS?',
      'What is CI/CD?',
      'How can I host a Spring Boot application?',
    ],
  },
],

mostCitedVideos: [
  {
    youtubeVideoId: 'abc123angular',
    videoTitle: 'Angular Complete Course for Beginners',
    citationCount: 94,
  },
  {
    youtubeVideoId: 'xyz456typescript',
    videoTitle: 'TypeScript Crash Course',
    citationCount: 71,
  },
  {
    youtubeVideoId: 'spring789boot',
    videoTitle: 'Spring Boot REST API Tutorial',
    citationCount: 43,
  },
],
};

const CLASSIFICATION_LABELS: Record<string, string> = {
  CONTENT_QUESTION: 'Content Question',
  GREETING: 'Greeting',
  SMALL_TALK: 'Small Talk',
  OUT_OF_SCOPE: 'Out of Scope',
  HARMFUL: 'Harmful',
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  CONTENT_QUESTION: '#3b82f6',
  GREETING: '#a78bfa',
  SMALL_TALK: '#22c55e',
  OUT_OF_SCOPE: '#f59e0b',
  HARMFUL: '#f87171',
};


function mockGetAnalysis(): Observable<ChatbotAnalysis> {
  return of(MOCK_ANALYSIS).pipe(delay(600));
}

function mockRegenerateAnalysis(): Observable<ChatbotAnalysis> {
  const refreshed: ChatbotAnalysis = {
    ...MOCK_ANALYSIS,
    generatedAt: new Date().toISOString(),
  };
  return of(refreshed).pipe(delay(2200));
}

function mockGetContentGapDetail(
  timestamp: string,
): Observable<ContentGapDetail> {
  const match = MOCK_ANALYSIS.contentGaps.find(
    (g) => g.timestamp === timestamp,
  );
  const detail: ContentGapDetail = {
    timestamp,
    topic: match?.topic ?? 'Unknown period',
    frequency: match?.frequency ?? 0,
    sampleQuestions: match?.sampleQuestions ?? [],
    summary: match
      ? `During this period, "${match.topic}" came up ${match.frequency} times without a matching video in your library. Consider a dedicated video covering this topic.`
      : undefined,
  };
  return of(detail).pipe(delay(500));
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule, SharedModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // ---- Page-level state ----
  isLoading = true;
  isRegenerating = false;
  loadError = false;
  analysis: ChatbotAnalysis | null = null;

  private detailSub?: Subscription;
  private mainSub?: Subscription;

  constructor(private zone: NgZone) {}

  classificationSeries: ApexAxisChartSeries = [];
  classificationChart: ApexChart = {
    type: 'bar',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
  };
  classificationPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '55%',
      distributed: true,
    },
  };
  classificationDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val}%`,
    style: { fontSize: '12px', fontWeight: 600 },
    offsetX: 8,
  };
  classificationXaxis: ApexXAxis = {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  classificationYaxis: ApexYAxis = {
    labels: { style: { fontSize: '13px' } },
  };
  classificationGrid: ApexGrid = {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  };
  classificationTooltip: ApexTooltip = {
    theme: 'dark',
    y: { formatter: (val: number) => `${val} messages` },
  };
  classificationColors: string[] = [];

  expandedClusterIndex: number | null = null;

  contentGapsSeries: ApexAxisChartSeries = [];


  contentGapsChart: ApexChart = {
    type: 'line',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    events: {
      dataPointSelection: (_event, _ctx, config) => {
        this.zone.run(() => {
          const index = config?.dataPointIndex;

          if (index == null || index < 0) {
            // ApexCharts reports -1 for clicks that land on the line/area
            // between points rather than directly on a marker — ignore
            // those rather than clearing whatever's already shown.
            return;
          }

          const point = this.analysis?.contentGaps?.[index];

          if (!point) {
            this.selectedGapPoint = null;
            this.gapDetail = null;
            this.gapDetailError = true;
            return;
          }

          this.selectGapPoint(point);
        });
      },
      markerClick: (_event, _ctx, config) => {
        this.zone.run(() => {
          const index = config?.dataPointIndex;
          const point =
            index != null && index >= 0
              ? this.analysis?.contentGaps?.[index]
              : null;
          if (point) this.selectGapPoint(point);
        });
      },
    },
  };
  contentGapsStroke: ApexStroke = {
    curve: 'smooth',
    width: 3,
    colors: ['#3b82f6'],
  };
  contentGapsMarkers: ApexMarkers = {
    size: 6,
    strokeColors: '#3b82f6',
    strokeWidth: 2,
    hover: { size: 8, sizeOffset: 3 },
  };
  contentGapsDataLabels: ApexDataLabels = { enabled: false };
  contentGapsXaxis: ApexXAxis = { categories: [] };
  contentGapsYaxis: ApexYAxis = {};
  contentGapsGrid: ApexGrid = { strokeDashArray: 4 };
  contentGapsTooltip: ApexTooltip = {
    theme: 'dark',
    y: { formatter: (val: number) => `${val} mentions` },
  };
  contentGapsColors: string[] = ['#3b82f6'];

  selectedGapPoint: ContentGapPoint | null = null;
  gapDetail: ContentGapDetail | null = null;
  isLoadingGapDetail = false;
  gapDetailError = false;

  ngOnInit() {
    this.loadAnalysis();
  }

  ngOnDestroy() {
    this.mainSub?.unsubscribe();
    this.detailSub?.unsubscribe();
  }

  loadAnalysis() {
    this.isLoading = true;
    this.loadError = false;

    const call$ = USE_REAL_API ? mockGetAnalysis() : mockGetAnalysis();

    this.mainSub = call$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => this.applyAnalysis(data),
        error: () => {
          this.loadError = true;
        },
      });
  }

  regenerate() {
    if (this.isRegenerating) return;
    this.isRegenerating = true;

    const call$ = USE_REAL_API
      ? mockRegenerateAnalysis()
      : mockRegenerateAnalysis();

    this.mainSub = call$
      .pipe(finalize(() => (this.isRegenerating = false)))
      .subscribe({
        next: (data) => this.applyAnalysis(data),
        error: () => {
        },
      });
  }

  private applyAnalysis(data: ChatbotAnalysis) {
    this.analysis = data;
    this.buildClassificationChart(data.classifications);
    this.buildContentGapsChart(data.contentGaps);

    this.clearGapSelection();
  }


  private buildClassificationChart(data: ClassificationBreakdown[]) {
    if (!data?.length) {
      this.classificationSeries = [];
      return;
    }
    const sorted = [...data].sort((a, b) => b.count - a.count);

    this.classificationSeries = [
      { name: 'Share of messages', data: sorted.map((d) => d.percent) },
    ];
    this.classificationXaxis = {
      ...this.classificationXaxis,
      categories: sorted.map((d) => CLASSIFICATION_LABELS[d.name] ?? d.name),
    };
    this.classificationColors = sorted.map(
      (d) => CLASSIFICATION_COLORS[d.name] ?? '#3b82f6',
    );
  }

  totalMessages(): number {
    if (!this.analysis) return 0;
    return this.analysis.classifications.reduce((sum, d) => sum + d.count, 0);
  }

  toggleCluster(index: number) {
    this.expandedClusterIndex =
      this.expandedClusterIndex === index ? null : index;
  }

  maxClusterCount(): number {
    if (!this.analysis?.mostAskedClusters?.length) return 1;
    return Math.max(...this.analysis.mostAskedClusters.map((d) => d.count), 1);
  }

  private buildContentGapsChart(data: ContentGapPoint[]) {
    if (!data?.length) {
      this.contentGapsSeries = [];
      return;
    }
    this.contentGapsSeries = [
      { name: 'Mentions', data: data.map((d) => d.frequency) },
    ];
    this.contentGapsXaxis = {
      ...this.contentGapsXaxis,
      categories: data.map((d) =>
        new Date(d.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
      ),
    };
  }

  selectGapPoint(point: ContentGapPoint) {
    this.selectedGapPoint = point;
    this.gapDetail = null;
    this.gapDetailError = false;
    this.isLoadingGapDetail = true;
    this.detailSub?.unsubscribe();

    const call$ = USE_REAL_API
      ? mockGetContentGapDetail(point.timestamp)
      : mockGetContentGapDetail(point.timestamp);

    this.detailSub = call$.subscribe({
      next: (detail) => {
        this.zone.run(() => {
          this.gapDetail = detail;
          this.isLoadingGapDetail = false;
        });
      },
      error: () => {
        this.zone.run(() => {
          this.gapDetailError = true;
          this.isLoadingGapDetail = false;
        });
      },
    });
  }

  retryGapDetail() {
    if (this.selectedGapPoint) this.selectGapPoint(this.selectedGapPoint);
  }

  clearGapSelection() {
    this.selectedGapPoint = null;
    this.gapDetail = null;
    this.gapDetailError = false;
    this.detailSub?.unsubscribe();
  }

  youtubeUrl(videoId: string): string {
    return `https://youtu.be/${videoId}`;
  }

  thumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  maxCitations(): number {
    if (!this.analysis?.mostCitedVideos?.length) return 1;
    return Math.max(
      ...this.analysis.mostCitedVideos.map((d) => d.citationCount),
      1,
    );
  }

  hideBrokenThumbnail(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}