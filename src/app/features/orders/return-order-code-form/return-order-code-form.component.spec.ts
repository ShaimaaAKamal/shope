import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderCodeFormComponent } from './return-order-code-form.component';

describe('ReturnOrderCodeFormComponent', () => {
  let component: ReturnOrderCodeFormComponent;
  let fixture: ComponentFixture<ReturnOrderCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnOrderCodeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnOrderCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
