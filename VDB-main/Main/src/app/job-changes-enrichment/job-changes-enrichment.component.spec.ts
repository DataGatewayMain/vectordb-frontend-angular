import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobChangesEnrichmentComponent } from './job-changes-enrichment.component';

describe('JobChangesEnrichmentComponent', () => {
  let component: JobChangesEnrichmentComponent;
  let fixture: ComponentFixture<JobChangesEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobChangesEnrichmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobChangesEnrichmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
