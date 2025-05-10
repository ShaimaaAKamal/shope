import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantOptionsValuesQuantityComponent } from './variant-options-values-quantity.component';

describe('VariantOptionsValuesQuantityComponent', () => {
  let component: VariantOptionsValuesQuantityComponent;
  let fixture: ComponentFixture<VariantOptionsValuesQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantOptionsValuesQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantOptionsValuesQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
