import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StatusCellRendererComponent } from './status-cell-renderer.component';

describe('StatusCellRendererComponent', () => {
  let component: StatusCellRendererComponent;
  let fixture: ComponentFixture<StatusCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCellRendererComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
