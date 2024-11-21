import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreInfopageComponent } from './more-infopage.component';

describe('MoreInfopageComponent', () => {
  let component: MoreInfopageComponent;
  let fixture: ComponentFixture<MoreInfopageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoreInfopageComponent]
    });
    fixture = TestBed.createComponent(MoreInfopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
