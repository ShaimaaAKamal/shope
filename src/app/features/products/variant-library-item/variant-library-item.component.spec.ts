import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantLibraryItemComponent } from './variant-library-item.component';

describe('VariantLibraryItemComponent', () => {
  let component: VariantLibraryItemComponent;
  let fixture: ComponentFixture<VariantLibraryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantLibraryItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantLibraryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
