import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsLibraryComponent } from './variants-library.component';

describe('VariantsLibraryComponent', () => {
  let component: VariantsLibraryComponent;
  let fixture: ComponentFixture<VariantsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantsLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
