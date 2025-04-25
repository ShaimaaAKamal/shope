import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentButtonsComponent } from './payment-buttons.component';

describe('PaymentButtonsComponent', () => {
  let component: PaymentButtonsComponent;
  let fixture: ComponentFixture<PaymentButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
