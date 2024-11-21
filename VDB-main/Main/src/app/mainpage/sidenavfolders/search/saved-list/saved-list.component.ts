import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { FilterService } from '../filters/filter.service';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent { 

  dataofsaved: any[] = [];
  includeCompanyName: string[] = [];
  excludeCompanyDomain: string[] = [];
  includecountry: string[] = [];
  includeJobTitles: string[] = [];

  // Initialize string representations for input binding
  includeCompanyNameString: string = '';
  excludeCompanyDomainString: string = '';
  includeCountryString: string = '';
  includeJobTitlesString: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.getSavedFilters();
    this.retrieveAndApplyFiltersFromLocalStorage()
  }

  getSavedFilters() {
    const api_key = this.authService.getapi_key();
    const Url = `https://api.vectordb.app/v1/search/people/getSaveFilter/?api=${api_key}`;
    this.http.get(Url).subscribe(
      (res: any) => {
        console.log('Response from API:', res);
        this.dataofsaved = res.results; // Update this line to reflect the correct structure
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
  navigateToFilter(savedFilter: any): void {
    // Save the selected filters to local storage
    localStorage.setItem('savedFilters', JSON.stringify(savedFilter));
    // Example: Update filter service with selected filters
    this.filterService.updateFilters(savedFilter);
    // Navigate to the filter component or route
    this.router.navigate(['home/search/people/right/total']);
  }
 

  retrieveAndApplyFiltersFromLocalStorage(): void {
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      
      // Update your properties based on the saved filters
      this.includeCompanyName = parsedFilters.include_company_name ? parsedFilters.include_company_name.split(', ') : [];
      this.excludeCompanyDomain = parsedFilters.excludeCompanyDomain ? parsedFilters.excludeCompanyDomain.split(', ') : [];
      this.includecountry = parsedFilters.include_country ? parsedFilters.include_country.split(', ') : [];
      this.includeJobTitles = parsedFilters.jobtitle ? parsedFilters.jobtitle.split(', ') : [];

      // Convert arrays to strings for input fields
      this.includeCompanyNameString = this.includeCompanyName.join(', ');
      this.excludeCompanyDomainString = this.excludeCompanyDomain.join(', ');
      this.includeCountryString = this.includecountry.join(', ');
      this.includeJobTitlesString = this.includeJobTitles.join(', ');
      
      console.log('Filters applied to input fields:', {
        includeCompanyNameString: this.includeCompanyNameString,
        excludeCompanyDomainString: this.excludeCompanyDomainString,
        includeCountryString: this.includeCountryString,
        includeJobTitlesString: this.includeJobTitlesString,
      });
    }
  }
  
}