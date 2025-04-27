import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldOrdersComponent } from './hold-orders.component';

describe('HoldOrdersComponent', () => {
  let component: HoldOrdersComponent;
  let fixture: ComponentFixture<HoldOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
