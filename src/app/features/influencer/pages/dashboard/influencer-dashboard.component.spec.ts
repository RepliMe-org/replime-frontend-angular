import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerDashboardComponent } from './influencer-dashboard.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('InfluencerDashboardComponent', () => {
  let component: InfluencerDashboardComponent;
  let fixture: ComponentFixture<InfluencerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerDashboardComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluencerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
