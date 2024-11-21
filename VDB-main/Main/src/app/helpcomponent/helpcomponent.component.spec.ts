import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpcomponentComponent } from './helpcomponent.component';

describe('HelpcomponentComponent', () => {
  let component: HelpcomponentComponent;
  let fixture: ComponentFixture<HelpcomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpcomponentComponent]
    });
    fixture = TestBed.createComponent(HelpcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
