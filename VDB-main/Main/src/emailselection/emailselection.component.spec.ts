import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailselectionComponent } from './emailselection.component';

describe('EmailselectionComponent', () => {
  let component: EmailselectionComponent;
  let fixture: ComponentFixture<EmailselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailselectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
