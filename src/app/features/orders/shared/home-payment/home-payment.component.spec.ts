import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePaymentComponent } from './home-payment.component';

describe('HomePaymentComponent', () => {
  let component: HomePaymentComponent;
  let fixture: ComponentFixture<HomePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
