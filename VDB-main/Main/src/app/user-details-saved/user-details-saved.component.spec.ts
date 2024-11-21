import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsSavedComponent } from './user-details-saved.component';

describe('UserDetailsSavedComponent', () => {
  let component: UserDetailsSavedComponent;
  let fixture: ComponentFixture<UserDetailsSavedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsSavedComponent]
    });
    fixture = TestBed.createComponent(UserDetailsSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
