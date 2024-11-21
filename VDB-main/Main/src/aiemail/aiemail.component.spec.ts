import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiemailComponent } from './aiemail.component';

describe('AiemailComponent', () => {
  let component: AiemailComponent;
  let fixture: ComponentFixture<AiemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiemailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
