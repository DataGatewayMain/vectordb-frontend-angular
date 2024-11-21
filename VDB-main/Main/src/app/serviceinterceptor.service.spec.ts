import { TestBed } from '@angular/core/testing';

import { ServiceinterceptorService } from './serviceinterceptor.service';

describe('ServiceinterceptorService', () => {
  let service: ServiceinterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceinterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
