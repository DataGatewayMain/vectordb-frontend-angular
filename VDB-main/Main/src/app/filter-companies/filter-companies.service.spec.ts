import { TestBed } from '@angular/core/testing';

import { FilterCompaniesService } from './filter-companies.service';

describe('FilterCompaniesService', () => {
  let service: FilterCompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterCompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
