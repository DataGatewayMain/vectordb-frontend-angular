import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingemailComponent } from './missingemail.component';

describe('MissingemailComponent', () => {
  let component: MissingemailComponent;
  let fixture: ComponentFixture<MissingemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingemailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissingemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
