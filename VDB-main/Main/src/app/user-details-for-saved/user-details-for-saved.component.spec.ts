import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsForSavedComponent } from './user-details-for-saved.component';

describe('UserDetailsForSavedComponent', () => {
  let component: UserDetailsForSavedComponent;
  let fixture: ComponentFixture<UserDetailsForSavedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsForSavedComponent]
    });
    fixture = TestBed.createComponent(UserDetailsForSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
