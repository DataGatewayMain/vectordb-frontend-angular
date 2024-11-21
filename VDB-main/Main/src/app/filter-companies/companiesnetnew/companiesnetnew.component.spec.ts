import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesnetnewComponent } from './companiesnetnew.component';

describe('CompaniesnetnewComponent', () => {
  let component: CompaniesnetnewComponent;
  let fixture: ComponentFixture<CompaniesnetnewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesnetnewComponent]
    });
    fixture = TestBed.createComponent(CompaniesnetnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
