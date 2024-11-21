import { TestBed } from '@angular/core/testing';

import { ServiceForemailverificationService } from './service-foremailverification.service';

describe('ServiceForemailverificationService', () => {
  let service: ServiceForemailverificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceForemailverificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
