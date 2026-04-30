import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDetailsCellRenderComponent } from './video-details-cell-render.component';

describe('VideoDetailsCellRenderComponent', () => {
  let component: VideoDetailsCellRenderComponent;
  let fixture: ComponentFixture<VideoDetailsCellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDetailsCellRenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoDetailsCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
