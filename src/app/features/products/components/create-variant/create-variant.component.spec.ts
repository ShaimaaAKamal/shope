import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariantComponent } from './create-variant.component';

describe('CreateVariantComponent', () => {
  let component: CreateVariantComponent;
  let fixture: ComponentFixture<CreateVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateVariantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
