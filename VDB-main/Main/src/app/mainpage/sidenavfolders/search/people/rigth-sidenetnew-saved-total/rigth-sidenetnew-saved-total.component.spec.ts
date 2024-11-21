import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RigthSidenetnewSavedTotalComponent } from './rigth-sidenetnew-saved-total.component';

describe('RigthSidenetnewSavedTotalComponent', () => {
  let component: RigthSidenetnewSavedTotalComponent;
  let fixture: ComponentFixture<RigthSidenetnewSavedTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RigthSidenetnewSavedTotalComponent]
    });
    fixture = TestBed.createComponent(RigthSidenetnewSavedTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
