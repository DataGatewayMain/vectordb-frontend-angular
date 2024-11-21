import { TestBed } from '@angular/core/testing';

import { FilterService } from './app/mainpage/sidenavfolders/search/filters/filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
