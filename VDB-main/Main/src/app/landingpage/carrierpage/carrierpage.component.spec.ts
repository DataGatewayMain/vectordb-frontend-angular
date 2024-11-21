import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierpageComponent } from './carrierpage.component';

describe('CarrierpageComponent', () => {
  let component: CarrierpageComponent;
  let fixture: ComponentFixture<CarrierpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrierpageComponent]
    });
    fixture = TestBed.createComponent(CarrierpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
