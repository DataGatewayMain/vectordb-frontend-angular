import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExporthistorydialogueComponent } from './exporthistorydialogue.component';

describe('ExporthistorydialogueComponent', () => {
  let component: ExporthistorydialogueComponent;
  let fixture: ComponentFixture<ExporthistorydialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExporthistorydialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExporthistorydialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
