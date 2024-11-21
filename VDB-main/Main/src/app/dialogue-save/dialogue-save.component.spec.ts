import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueSaveComponent } from './dialogue-save.component';

describe('DialogueSaveComponent', () => {
  let component: DialogueSaveComponent;
  let fixture: ComponentFixture<DialogueSaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogueSaveComponent]
    });
    fixture = TestBed.createComponent(DialogueSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
