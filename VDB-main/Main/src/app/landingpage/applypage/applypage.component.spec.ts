import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplypageComponent } from './applypage.component';

describe('ApplypageComponent', () => {
  let component: ApplypageComponent;
  let fixture: ComponentFixture<ApplypageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplypageComponent]
    });
    fixture = TestBed.createComponent(ApplypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
