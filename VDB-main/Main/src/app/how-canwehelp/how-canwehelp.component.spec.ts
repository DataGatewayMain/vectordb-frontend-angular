import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowCanwehelpComponent } from './how-canwehelp.component';

describe('HowCanwehelpComponent', () => {
  let component: HowCanwehelpComponent;
  let fixture: ComponentFixture<HowCanwehelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowCanwehelpComponent]
    });
    fixture = TestBed.createComponent(HowCanwehelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
