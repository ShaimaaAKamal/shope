import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInVoiceNewCustomerComponent } from './add-in-voice-new-customer.component';

describe('AddInVoiceNewCustomerComponent', () => {
  let component: AddInVoiceNewCustomerComponent;
  let fixture: ComponentFixture<AddInVoiceNewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddInVoiceNewCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInVoiceNewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
