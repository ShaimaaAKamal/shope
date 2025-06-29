import { TestBed } from '@angular/core/testing';

import { HandleActualApiInvokeService } from './handle-actual-api-invoke.service';

describe('HandleActualApiInvokeService', () => {
  let service: HandleActualApiInvokeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleActualApiInvokeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
