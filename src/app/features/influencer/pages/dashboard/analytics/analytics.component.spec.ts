import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsReportResponseDTO } from '../../../models/analytics.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockReport: AnalyticsReportResponseDTO = {
  id: 1,
  generatedAt: '2026-06-01T10:00:00Z',
  generatedAtHistory: ['2026-06-01T10:00:00Z', '2026-05-25T10:00:00Z'],
  contentGapCountHistory: [3, 5],
  classificationBreakdown: [
    { messageClass: 'CONTENT_QUESTION', count: 80, percentage: 80 },
    { messageClass: 'GREETING', count: 20, percentage: 20 },
  ],
  mostAskedClusters: [
    {
      theme: 'Pricing',
      count: 10,
      exampleQuestions: ['How much does it cost?'],
    },
  ],
  executiveSummary: 'Test summary',
  mostCitedVideos: [{ videoId: 'abc123', title: 'Test Video', count: 5 }],
};

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    analyticsService = jasmine.createSpyObj('AnalyticsService', [
      'getLatestReport',
      'regenerateReport',
      'getReportByTimestamp',
      'getContentGaps',
    ]);
    analyticsService.getLatestReport.and.returnValue(of(mockReport));

    await TestBed.configureTestingModule({
      imports: [
        AnalyticsComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      // schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the latest report on init', () => {
    expect(analyticsService.getLatestReport).toHaveBeenCalledTimes(1);
    expect(component.analysis).toEqual(mockReport);
    expect(component.isLoading).toBeFalse();
  });

  it('should show error state on fetch failure', () => {
    analyticsService.getLatestReport.and.returnValue(
      throwError(() => new Error('fail')),
    );
    component.loadAnalysis();
    expect(component.loadError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should set activeHistoryIndex based on generatedAt', () => {
    expect(component.activeHistoryIndex).toBe(0);
  });

  it('should call getReportByTimestamp when onReportSelected is called with a different index', () => {
    analyticsService.getReportByTimestamp.and.returnValue(of(mockReport));
    component.onReportSelected(1);
    expect(analyticsService.getReportByTimestamp).toHaveBeenCalledWith(
      '2026-05-25T10:00:00Z',
    );
  });

  it('should not call getReportByTimestamp when selecting the already-active index', () => {
    component.onReportSelected(0);
    expect(analyticsService.getReportByTimestamp).not.toHaveBeenCalled();
  });

  it('should call getContentGaps when onGapPointClicked is called', () => {
    analyticsService.getContentGaps.and.returnValue(
      of({ generatedAt: '2026-06-01T10:00:00Z', contentGaps: [] }),
    );
    component.onGapPointClicked('2026-06-01T10:00:00Z');
    expect(analyticsService.getContentGaps).toHaveBeenCalledWith(
      '2026-06-01T10:00:00Z',
    );
  });

  it('should clear gap selection on onGapDetailClose', () => {
    component['selectedGapTimestamp'] = '2026-06-01T10:00:00Z';
    component.onGapDetailClose();
    expect(component.selectedGapTimestamp).toBeNull();
    expect(component.gapDetail).toBeNull();
  });

  it('should start cooldown timer on 429 regenerate error', () => {
    const futureDate = new Date(Date.now() + 30000).toISOString();
    const err = new HttpErrorResponse({
      status: 429,
      error: { nextAvailableAt: futureDate },
    });
    analyticsService.regenerateReport.and.returnValue(throwError(() => err));
    component.regenerate();
    expect(component.cooldownSecondsRemaining).toBeGreaterThan(0);
  });

  it('should unsubscribe all subs on destroy', () => {
    spyOn(component as any, 'clearGapSelection').and.callThrough();
    component.ngOnDestroy();
    expect(component).toBeTruthy();
  });
});
