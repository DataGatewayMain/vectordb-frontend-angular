import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSavedsearchComponent } from './name-savedsearch.component';

describe('NameSavedsearchComponent', () => {
  let component: NameSavedsearchComponent;
  let fixture: ComponentFixture<NameSavedsearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameSavedsearchComponent]
    });
    fixture = TestBed.createComponent(NameSavedsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
