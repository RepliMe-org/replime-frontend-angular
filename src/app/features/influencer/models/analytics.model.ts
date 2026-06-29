export interface ClassificationCount {
  messageClass: string;
  count: number;
  percentage: number;
}

export interface MostAskedCluster {
  theme: string;
  count: number;
  exampleQuestions: string[];
}

export interface CitedVideo {
  videoId: string;
  title: string;
  count: number;
}

export interface AnalyticsReportResponseDTO {
  id: number;
  generatedAt: string;
  generatedAtHistory: string[];
  contentGapCountHistory: number[];
  classificationBreakdown: ClassificationCount[];
  mostAskedClusters: MostAskedCluster[];
  executiveSummary: string;
  mostCitedVideos: CitedVideo[];
}

export interface ContentGapItem {
  topic?: string;
  cluster?: string;
  frequency?: number;
  count?: number;
  sampleQuestions?: string[];
  summary?: string;
  // [key: string]: unknown;
}

export interface ContentGapResponseDTO {
  generatedAt: string;
  contentGaps: ContentGapItem[];
}

export interface AnalyticsCooldownError {
  timestamp: string;
  success: false;
  error: string;
  nextAvailableAt: string;
}
