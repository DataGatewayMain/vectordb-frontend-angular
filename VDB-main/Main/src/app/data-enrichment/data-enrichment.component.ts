import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-enrichment',
  templateUrl: './data-enrichment.component.html',
  styleUrls: ['./data-enrichment.component.css']
})
export class DataEnrichmentComponent implements OnInit {
   activeSection: string = 'dataHealthCenter';
  savedData: any[] = [];
  savedCount: number = 0;
  matchingRecords: number = 0;
  nonMatchingRecords: number = 0;
  missingEmailRecords: number = 0;
  recordsWithEmail: number = 0;
  matchingPercentage: number = 0;
  nonMatchingPercentage: number = 0;
  missingEmailPercentage: number = 0;
  recordsWithEmailPercentage: number = 0;
  filteredResultsMissingEmailPercentage: number = 0;
  constructor(private getDataService: GetDataService, private snackbar: MatSnackBar) {}

 ngOnInit() {
    this.getSavedSearchData();
    this.fetchJobChanges(); 
    this.search(); 
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  constructFilters(): any {
    return {
      include_job_title: "",
      include_country: "",
      include_company_domain: "",
      include_company_name: "",
      include_state: "",
      include_city: "",
      include_region: "",
      include_Industry: "",
      include_Zip_Code: "",
      include_sic: "",
      include_naic: "",
      include_employee_size: "",
      include_job_function: "",
      include_job_level: "",
      exclude_job_title: "",
      exclude_industry: "",
      exclude_company_name: "",
      exclude_country: "",
      exclude_company_domain: ""
    };
  }
  selectedRows: any[] = [];
  results: any[] = []; 
  filteredResults: any[] = [];
  count: number = 0; 
  totalPages: number = 0; 
  paginationTotal: any;
  updatedPids: string[] = []; 
  currentPage: number = 1;
  loading: boolean = true;
  filters: any = {}; 
  emailChangePercentage: number = 0; // Initialize to 0
  remainingEmailPercentage: number = 100; // Initialize to 100
  jobChangePercentage: number = 0; // Initialize to 0
  remainingjobPercentage: number = 100; 
  search(): void {
    
    const filtersToSend = this.constructFilters();
    this.getDataService.savedsearch(filtersToSend, this.currentPage).subscribe(
      (data: any) => {
        if (data && data.saved_data) {
          this.results = data.saved_data; 
          this.count = data.saved_count || 0;
          // this.per=this.results.length
          console.log(this.results.length,'this is the length of result in  dataenrichment ');
          this.emailChangeCount = this.emailChangesData.length;
          if (this.results.length > 0) {  
            this.emailChangePercentage = (this.emailChangeCount / this.results.length) * 100;  
            this.remainingEmailPercentage = 100 - this.emailChangePercentage;
          } else {
            this.emailChangePercentage = 0;
          }

          this.jobChangeCount = this.jobChangesData.length;
          if (this.results.length > 0) {  
            this.jobChangePercentage = (this.jobChangeCount / this.results.length) * 100; 
            this.remainingjobPercentage=100-this.jobChangePercentage
          } else {
            this.jobChangePercentage = 0;
          }


          this.filteredResults = this.results.filter(result => 
            this.updatedPids.includes(result.pid)
          );








          
          if (data.saved_pagination) {
            this.totalPages = data.saved_pagination.total_pages_saved || 0;
          } else {
            console.error('Pagination data missing from backend response.');
            this.totalPages = 0;
          }

         

        } else {
          console.error('Unexpected data structure: no saved_data');
          this.results = []; 
          this.count = 0;
          this.totalPages = 0;
          this.snackbar.open('No data available for the current search.', 'Close', {
            duration: 3000,
          });
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        this.loading = false;
        this.snackbar.open('Error fetching data. Please try again later.', 'Close', {
          duration: 3000,
        });
      },
      () => {
        this.loading = false; 
      }
    );
  }

  getSavedSearchData(): void {
    this.getDataService.savedsearch({}, 1).subscribe(
      (response) => {
        if (response) {
          this.savedData = response.saved_data;
          this.savedCount = response.saved_count;

          // Calculate metrics
          this.matchingRecords = this.savedData.filter(data => 
            !data.emailStatus || !data.companyStatus || !data.jobTitleStatus
          ).length;

          this.nonMatchingRecords = this.savedCount - this.matchingRecords;
          this.missingEmailRecords = this.savedData.filter(data => !data.email_address || data.email_address.trim() === '').length;
          this.recordsWithEmail = this.savedCount - this.missingEmailRecords;

          // Calculate percentages
          if (this.savedCount > 0) {
            this.filteredResultsMissingEmailPercentage = (this.filteredResults.length / this.savedCount) * 100;
          } else {
            this.filteredResultsMissingEmailPercentage = 0;
          }
        }
      },
      (error) => {
        console.error('Error fetching saved search data:', error);
        this.snackbar.open('Error fetching data. Please try again later.', 'Close', {
          duration: 3000,
        });
      }
    );
  }
  emailChangeCount: number = 0; // New property for count of email changes
  // emailChangePercentage: number = 0; // New property for percentage of email changes
  jobChangeCount:number=0
  // jobChangePercentage: number = 0;
  // Existing methods...
  jobChangesData: any[] = [];
  updatedCount: number = 0;
  emailChangesData:any[]=[]
  fetchJobChanges() {
    const filtersToSend = this.constructFilters();
    this.getDataService.jobChanges(filtersToSend).subscribe(
      (response: { updated_count: number; updated_data: any[] }) => {
        if (response) {
          this.updatedCount = response.updated_count;
  
          // Only get items where the email has changed
          this.emailChangesData = response.updated_data.filter(item => item.v19_email !== item.email_address);
          this.updatedPids = this.emailChangesData.map(item => item.pid);
 
          // Calculate email change count and percentage
          this.emailChangeCount = this.emailChangesData.length;
          // if (this.results.length > 0) {  // Correctly check the length of the array
          //   this.emailChangePercentage = (this.emailChangeCount / this.results.length) * 100;  // Use length for calculation
          // } else {
          //   this.emailChangePercentage = 0;
          // }


          this.jobChangesData = response.updated_data.filter(item => item.v19_title !== item.job_title);
          this.updatedPids = this.jobChangesData.map(item => item.pid);
 
          // Calculate email change count and percentage
          this.jobChangeCount = this.jobChangesData.length;
        }
      },
      (error: any) => {
        console.error('Error fetching job changes:', error);
      }
    );
  }
  



}



