import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLinkDialogComponent } from './email-link-dialog.component';

describe('EmailLinkDialogComponent', () => {
  let component: EmailLinkDialogComponent;
  let fixture: ComponentFixture<EmailLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailLinkDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
