import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCategoryVariantComponent } from './generic-category-variant.component';

describe('GenericCategoryVariantComponent', () => {
  let component: GenericCategoryVariantComponent;
  let fixture: ComponentFixture<GenericCategoryVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericCategoryVariantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCategoryVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
