import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExporthistoryComponent } from './exporthistory.component';

describe('ExporthistoryComponent', () => {
  let component: ExporthistoryComponent;
  let fixture: ComponentFixture<ExporthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExporthistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExporthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
