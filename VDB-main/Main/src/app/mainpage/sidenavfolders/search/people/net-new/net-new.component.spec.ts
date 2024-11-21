import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetNewComponent } from './net-new.component';

describe('NetNewComponent', () => {
  let component: NetNewComponent;
  let fixture: ComponentFixture<NetNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetNewComponent]
    });
    fixture = TestBed.createComponent(NetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
