import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantTypeCenterComponent } from './variant-type-center.component';

describe('VariantTypeCenterComponent', () => {
  let component: VariantTypeCenterComponent;
  let fixture: ComponentFixture<VariantTypeCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantTypeCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantTypeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
