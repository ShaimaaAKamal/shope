import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickingComponent } from './color-picking.component';

describe('ColorPickingComponent', () => {
  let component: ColorPickingComponent;
  let fixture: ComponentFixture<ColorPickingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorPickingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
