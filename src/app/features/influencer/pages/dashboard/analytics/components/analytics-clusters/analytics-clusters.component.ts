import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostAskedCluster } from '../../../../../models/analytics.model';

@Component({
  selector: 'app-analytics-clusters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-clusters.component.html',
  styleUrl: './analytics-clusters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsClustersComponent {
  @Input({ required: true }) clusters: MostAskedCluster[] = [];

  expandedClusterIndex: number | null = null;

  toggleCluster(index: number) {
    this.expandedClusterIndex = this.expandedClusterIndex === index ? null : index;
  }

  maxClusterCount() {
    if (!this.clusters?.length) return 1;
    return Math.max(...this.clusters.map((c) => c.count), 1);
  }
}
