import { TestBed } from '@angular/core/testing';

import { SearchPeopleService } from './search-people.service';

describe('SearchPeopleService', () => {
  let service: SearchPeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
