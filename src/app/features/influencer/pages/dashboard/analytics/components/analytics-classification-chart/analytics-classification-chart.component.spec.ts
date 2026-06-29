import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { AnalyticsClassificationChartComponent } from './analytics-classification-chart.component';
import { ClassificationCount } from '../../../../../models/analytics.model';

const mockBreakdown: ClassificationCount[] = [
  { messageClass: 'GREETING', count: 20, percentage: 20 },
  { messageClass: 'CONTENT_QUESTION', count: 80, percentage: 80 },
];

describe('AnalyticsClassificationChartComponent', () => {
  let component: AnalyticsClassificationChartComponent;
  let fixture: ComponentFixture<AnalyticsClassificationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsClassificationChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsClassificationChartComponent);
    component = fixture.componentInstance;
    component.breakdown = mockBreakdown;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('totalMessages()', () => {
    it('should sum counts from all breakdown items', () => {
      expect(component.totalMessages()).toBe(100);
    });

    it('should return 0 when breakdown is empty', () => {
      component.breakdown = [];
      expect(component.totalMessages()).toBe(0);
    });

    it('should return 0 when breakdown is null/undefined', () => {
      component.breakdown = null as any;
      expect(component.totalMessages()).toBe(0);
    });
  });

  describe('ngOnChanges()', () => {
    it('should build series from breakdown on change', () => {
      component.ngOnChanges({
        breakdown: new SimpleChange([], mockBreakdown, false),
      });
      expect(component.series.length).toBe(1);
    });

    it('should sort breakdown by count descending in the series', () => {
      component.ngOnChanges({
        breakdown: new SimpleChange([], mockBreakdown, false),
      });
      const data = (component.series[0] as any).data as number[];
      expect(data[0]).toBe(80);
      expect(data[1]).toBe(20);
    });

    it('should set xaxis categories in sorted order (highest count first)', () => {
      component.ngOnChanges({
        breakdown: new SimpleChange([], mockBreakdown, false),
      });
      const categories = component.xaxis.categories as string[];
      expect(categories[0]).toBe('CONTENT_QUESTION');
      expect(categories[1]).toBe('GREETING');
    });

    it('should clear series when breakdown is empty', () => {
      component.breakdown = [];
      component.ngOnChanges({
        breakdown: new SimpleChange(mockBreakdown, [], false),
      });
      expect(component.series).toEqual([]);
    });

    it('should clear series when breakdown is null', () => {
      component.breakdown = null as any;
      component.ngOnChanges({
        breakdown: new SimpleChange(mockBreakdown, null, false),
      });
      expect(component.series).toEqual([]);
    });

    it('should use percentage values in series data', () => {
      component.ngOnChanges({
        breakdown: new SimpleChange([], mockBreakdown, false),
      });
      const data = (component.series[0] as any).data as number[];
      expect(data[0]).toBe(80);
    });
  });
});
