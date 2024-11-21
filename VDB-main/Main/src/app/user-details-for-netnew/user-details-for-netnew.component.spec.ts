import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsForNetnewComponent } from './user-details-for-netnew.component';

describe('UserDetailsForNetnewComponent', () => {
  let component: UserDetailsForNetnewComponent;
  let fixture: ComponentFixture<UserDetailsForNetnewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsForNetnewComponent]
    });
    fixture = TestBed.createComponent(UserDetailsForNetnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
