import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryDataEnrichmentComponent } from './catagory-data-enrichment.component';

describe('CatagoryDataEnrichmentComponent', () => {
  let component: CatagoryDataEnrichmentComponent;
  let fixture: ComponentFixture<CatagoryDataEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatagoryDataEnrichmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatagoryDataEnrichmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
