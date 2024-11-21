import { Component } from '@angular/core';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterService } from '../mainpage/sidenavfolders/search/filters/filter.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
  selector: 'app-name-savedsearch',
  templateUrl: './name-savedsearch.component.html',
  styleUrls: ['./name-savedsearch.component.css']
})
export class NameSavedsearchComponent {
  includeCompanyName: any;
  includeCity: any;
  includeState: any;
  includeIndustry: any;
  includeRegion: any;
  includeJobTitles: any;
  includeCompanyDomain: any;
  excludeJobTitles: any;
  excludeCountry: any;
  excludeCompanyName: any;
  excludeCompanyDomain: any;
  constructor(private apiService:GetDataService,private service:FilterService,private dialog:MatDialog,private snackbar:MatSnackBar){


  }

  closeUserDialog() {
    this.dialog.closeAll()
 }
 onSaveSearch(name: string): void {
  console.log('Save button clicked. Search name:', name);

  const filters = this.filtersSubject.value;
  console.log('Filters to be saved:', filters);

  // Convert the filters object to a string
  const filtersString = JSON.stringify(filters);

  // Send the search name and filters string to the backend
  this.apiService.saveSearch(name, filtersString).subscribe(
    () => {
      console.log('Search saved successfully!');
      this.snackbar.open('List saved successfully', '', {
        duration: 1000
      });
      this.closeUserDialog();
    },
    (error: any) => {
      console.error('Error saving search:', error);
    }
  );

 }

  private filtersSubject = new BehaviorSubject<any>({ include_job_title: [] });
  filters$ = this.filtersSubject.asObservable();

  

  ngOnInit(): void {
    this.getCurrentFilters();
  }

  private getCurrentFilters(): void {
    const filters = this.service.getCurrentFilters();
    this.filtersSubject.next(filters);
    console.log(filters, 'current filters');
  }

  updateFilters(filters: any): void {
    // Merge the new filters with the existing ones
    const mergedFilters = { ...this.filtersSubject.value, ...filters };
    this.filtersSubject.next(mergedFilters);
    console.log(mergedFilters, 'this is the merged filters');
  }












  
}


