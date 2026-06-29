import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AnalyticsContentGapsComponent } from './analytics-content-gaps.component';
import { ContentGapItem } from '../../../../../models/analytics.model';

const mockHistory = [
  '2026-06-10T00:00:00Z',
  '2026-06-03T00:00:00Z',
  '2026-05-27T00:00:00Z',
];
const mockCounts = [5, 3, 8];

describe('AnalyticsContentGapsComponent', () => {
  let component: AnalyticsContentGapsComponent;
  let fixture: ComponentFixture<AnalyticsContentGapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsContentGapsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsContentGapsComponent);
    component = fixture.componentInstance;

    component.generatedAtHistory = mockHistory;
    component.contentGapCountHistory = mockCounts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    it('should build series data when generatedAtHistory changes', () => {
      component.ngOnChanges({
        generatedAtHistory: new SimpleChange([], mockHistory, false),
      });
      expect(component.series.length).toBe(1);
      expect((component.series[0] as any).data.length).toBe(3);
    });

    it('should render data chronologically (oldest→newest) in the series', () => {
      component.ngOnChanges({
        generatedAtHistory: new SimpleChange([], mockHistory, false),
      });

      const data = (component.series[0] as any).data;
      expect(data[0]).toBe(8);
      expect(data[1]).toBe(3);
      expect(data[2]).toBe(5);
    });

    it('should clear series when generatedAtHistory is empty', () => {
      component.generatedAtHistory = [];
      component.contentGapCountHistory = [];
      component.ngOnChanges({
        generatedAtHistory: new SimpleChange(mockHistory, [], false),
      });
      expect(component.series).toEqual([]);
    });

    it('should not rebuild chart when unrelated inputs change', () => {
      const seriesBefore = component.series;
      component.ngOnChanges({
        gapDetail: new SimpleChange(null, [], false),
      });
      expect(component.series).toBe(seriesBefore);
    });
  });

  describe('gapItemTopic()', () => {
    it('should return topic when present', () => {
      const item = { topic: 'Pricing', frequency: 10 } as ContentGapItem;
      expect(component.gapItemTopic(item)).toBe('Pricing');
    });

    it('should fall back to cluster when topic is absent', () => {
      const item = { cluster: 'Refunds', count: 2 } as ContentGapItem;
      expect(component.gapItemTopic(item)).toBe('Refunds');
    });

    it("should return 'Untitled topic' when both topic and cluster are absent", () => {
      const item = {} as ContentGapItem;
      expect(component.gapItemTopic(item)).toBe('Untitled topic');
    });
  });

  describe('gapItemFrequency()', () => {
    it('should return frequency when present', () => {
      const item = { frequency: 7 } as ContentGapItem;
      expect(component.gapItemFrequency(item)).toBe(7);
    });

    it('should fall back to count when frequency is absent', () => {
      const item = { count: 4 } as ContentGapItem;
      expect(component.gapItemFrequency(item)).toBe(4);
    });

    it('should return 0 when both frequency and count are absent', () => {
      const item = {} as ContentGapItem;
      expect(component.gapItemFrequency(item)).toBe(0);
    });
  });

  describe('onCloseDetail()', () => {
    it('should reset selectedChronologicalIndex to null', () => {
      component.selectedChronologicalIndex = 2;
      component.onCloseDetail();
      expect(component.selectedChronologicalIndex).toBeNull();
    });

    it('should emit the closeDetail event', () => {
      const emitSpy = spyOn(component.closeDetail, 'emit');
      component.onCloseDetail();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('x-axis categories', () => {
    it('should set xaxis categories as formatted date strings', () => {
      component.ngOnChanges({
        generatedAtHistory: new SimpleChange([], mockHistory, false),
      });
      const cats = component.xaxis?.categories as string[];
      expect(cats.length).toBe(3);
      cats.forEach((cat) => expect(typeof cat).toBe('string'));
      expect(cats[0].length).toBeGreaterThan(0);
    });
  });
});
