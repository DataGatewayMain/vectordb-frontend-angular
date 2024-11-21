import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkInboxEmailComponent } from './bulk-inbox-email.component';

describe('BulkInboxEmailComponent', () => {
  let component: BulkInboxEmailComponent;
  let fixture: ComponentFixture<BulkInboxEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkInboxEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkInboxEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
