import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopScreenComponent } from './pop-screen.component';

describe('PopScreenComponent', () => {
  let component: PopScreenComponent;
  let fixture: ComponentFixture<PopScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
