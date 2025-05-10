import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsPopComponent } from './product-details-pop.component';

describe('ProductDetailsPopComponent', () => {
  let component: ProductDetailsPopComponent;
  let fixture: ComponentFixture<ProductDetailsPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsPopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
