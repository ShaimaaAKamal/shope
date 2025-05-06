import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantValueDetailsComponent } from './variant-value-details.component';

describe('VariantValueDetailsComponent', () => {
  let component: VariantValueDetailsComponent;
  let fixture: ComponentFixture<VariantValueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantValueDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantValueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
