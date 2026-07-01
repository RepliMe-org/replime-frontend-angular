import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingSectionComponent } from './trending-section.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('TrendingSectionComponent', () => {
  let component: TrendingSectionComponent;
  let fixture: ComponentFixture<TrendingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingSectionComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
