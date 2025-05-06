import { TestBed } from '@angular/core/testing';

import { ProductVariantOptionsService } from './product-variant-options.service';

describe('ProductVariantOptionsService', () => {
  let service: ProductVariantOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductVariantOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
