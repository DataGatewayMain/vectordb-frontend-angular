import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToSequenceComponent } from './add-to-sequence.component';

describe('AddToSequenceComponent', () => {
  let component: AddToSequenceComponent;
  let fixture: ComponentFixture<AddToSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToSequenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
