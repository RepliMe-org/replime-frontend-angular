import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserRoleBadgeComponent } from './user-role-badge.component';

describe('UserRoleBadgeComponent', () => {
  let component: UserRoleBadgeComponent;
  let fixture: ComponentFixture<UserRoleBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleBadgeComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
