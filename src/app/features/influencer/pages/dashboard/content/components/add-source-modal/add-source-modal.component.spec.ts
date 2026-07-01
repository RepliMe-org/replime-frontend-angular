import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddSourceModalComponent } from './add-source-modal.component';

describe('AddSourceModalComponent', () => {
  let component: AddSourceModalComponent;
  let fixture: ComponentFixture<AddSourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSourceModalComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
