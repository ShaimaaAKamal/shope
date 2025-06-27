import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantTypeComponent } from './variant-type.component';

describe('VariantTypeComponent', () => {
  let component: VariantTypeComponent;
  let fixture: ComponentFixture<VariantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
