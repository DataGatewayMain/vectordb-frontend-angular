import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideForCompanyNameComponent } from './guide-for-company-name.component';

describe('GuideForCompanyNameComponent', () => {
  let component: GuideForCompanyNameComponent;
  let fixture: ComponentFixture<GuideForCompanyNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuideForCompanyNameComponent]
    });
    fixture = TestBed.createComponent(GuideForCompanyNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
