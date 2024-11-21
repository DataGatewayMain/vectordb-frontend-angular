import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchesComponent } from './saved-searches.component';

describe('SavedSearchesComponent', () => {
  let component: SavedSearchesComponent;
  let fixture: ComponentFixture<SavedSearchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedSearchesComponent]
    });
    fixture = TestBed.createComponent(SavedSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
