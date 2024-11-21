import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxEmailComponent } from './inbox-email.component';

describe('InboxEmailComponent', () => {
  let component: InboxEmailComponent;
  let fixture: ComponentFixture<InboxEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxEmailComponent]
    });
    fixture = TestBed.createComponent(InboxEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
