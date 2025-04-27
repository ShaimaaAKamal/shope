import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteButtonComponent } from './site-button.component';

describe('SiteButtonComponent', () => {
  let component: SiteButtonComponent;
  let fixture: ComponentFixture<SiteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
