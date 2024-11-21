import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaildialogueComponent } from './emaildialogue.component';

describe('EmaildialogueComponent', () => {
  let component: EmaildialogueComponent;
  let fixture: ComponentFixture<EmaildialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmaildialogueComponent]
    });
    fixture = TestBed.createComponent(EmaildialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
