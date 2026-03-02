import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerDashboardComponent } from './influencer-dashboard.component';

describe('InfluencerDashboardComponent', () => {
  let component: InfluencerDashboardComponent;
  let fixture: ComponentFixture<InfluencerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerDashboardComponent]
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
