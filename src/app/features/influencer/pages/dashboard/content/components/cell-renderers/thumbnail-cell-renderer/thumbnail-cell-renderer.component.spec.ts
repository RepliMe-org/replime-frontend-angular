import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailCellRendererComponent } from './thumbnail-cell-renderer.component';

describe('ThumbnailCellRendererComponent', () => {
  let component: ThumbnailCellRendererComponent;
  let fixture: ComponentFixture<ThumbnailCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailCellRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
