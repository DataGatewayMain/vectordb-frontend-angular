import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideForCompaniesComponent } from './right-side-for-companies.component';

describe('RightSideForCompaniesComponent', () => {
  let component: RightSideForCompaniesComponent;
  let fixture: ComponentFixture<RightSideForCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightSideForCompaniesComponent]
    });
    fixture = TestBed.createComponent(RightSideForCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
