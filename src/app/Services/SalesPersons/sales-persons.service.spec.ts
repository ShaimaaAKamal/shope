import { TestBed } from '@angular/core/testing';

import { SalesPersonsService } from './sales-persons.service';

describe('SalesPersonsService', () => {
  let service: SalesPersonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPersonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
