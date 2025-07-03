import { TestBed } from '@angular/core/testing';

import { PaginationContextService } from './pagination-context.service';

describe('PaginationContextService', () => {
  let service: PaginationContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
