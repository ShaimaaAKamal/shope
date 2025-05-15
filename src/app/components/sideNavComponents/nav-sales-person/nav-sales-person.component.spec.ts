import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSalesPersonComponent } from './nav-sales-person.component';

describe('NavSalesPersonComponent', () => {
  let component: NavSalesPersonComponent;
  let fixture: ComponentFixture<NavSalesPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavSalesPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
