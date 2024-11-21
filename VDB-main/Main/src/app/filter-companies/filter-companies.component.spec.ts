import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCompaniesComponent } from './filter-companies.component';

describe('FilterCompaniesComponent', () => {
  let component: FilterCompaniesComponent;
  let fixture: ComponentFixture<FilterCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterCompaniesComponent]
    });
    fixture = TestBed.createComponent(FilterCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
