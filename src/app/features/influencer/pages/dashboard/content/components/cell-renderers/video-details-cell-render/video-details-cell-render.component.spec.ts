import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VideoDetailsCellRendererComponent } from './video-details-cell-render.component';

describe('VideoDetailsCellRendererComponent', () => {
  let component: VideoDetailsCellRendererComponent;
  let fixture: ComponentFixture<VideoDetailsCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDetailsCellRendererComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoDetailsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
