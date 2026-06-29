import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { AnalyticsClustersComponent } from './analytics-clusters.component';
import { MostAskedCluster } from '../../../../../models/analytics.model';

const mockClusters: MostAskedCluster[] = [
  {
    theme: 'Pricing',
    count: 10,
    exampleQuestions: ['How much?', 'Is it free?'],
  },
  { theme: 'Features', count: 7, exampleQuestions: ['What can it do?'] },
];

describe('AnalyticsClustersComponent', () => {
  let component: AnalyticsClustersComponent;
  let fixture: ComponentFixture<AnalyticsClustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsClustersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsClustersComponent);
    component = fixture.componentInstance;
    component.clusters = mockClusters;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should start with no cluster expanded', () => {
    expect(component.expandedClusterIndex).toBeNull();
  });

  it('should expand a cluster on toggleCluster()', () => {
    component.toggleCluster(0);
    expect(component.expandedClusterIndex).toBe(0);
  });

  it('should collapse an already-expanded cluster on second toggleCluster()', () => {
    component.toggleCluster(0);
    component.toggleCluster(0);
    expect(component.expandedClusterIndex).toBeNull();
  });

  it('should switch expanded cluster when a different one is toggled', () => {
    component.toggleCluster(0);
    component.toggleCluster(1);
    expect(component.expandedClusterIndex).toBe(1);
  });

  it('should return the highest cluster count from maxClusterCount()', () => {
    expect(component.maxClusterCount()).toBe(10);
  });

  it('should return 1 from maxClusterCount() when clusters is empty', () => {
    component.clusters = [];
    expect(component.maxClusterCount()).toBe(1);
  });
});
