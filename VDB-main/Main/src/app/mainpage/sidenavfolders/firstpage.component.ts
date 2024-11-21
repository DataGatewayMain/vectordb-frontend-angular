import { Component, OnInit } from '@angular/core';
import { GetDataService } from './search/people/get-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterService } from './search/filters/filter.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css'],
  providers: [DatePipe]
})
export class FirstpageComponent implements OnInit {
  userFirstName: string | null | undefined;
  userLastName: string | null | undefined;
  usercredit: number = 0; // Initialize as number
  total_records: any;
  savedData: any;
  displayedData: any;
  saved_records: any;
  showSavedSearches = false;
  showRecentActivity = true;
  savedFilters: any[] = [];
  location!: string | null;
  renewalDate: string;

  constructor(
    private getDataService: GetDataService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,private datePipe: DatePipe
  ) {this.renewalDate = this.getRenewalDate(30);
    this.selectedTemplate = 'productOffering';  
  }

  getRenewalDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return this.datePipe.transform(today, 'MMM d, yyyy h:mm a') || '';
  }

  ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName');
    this.userLastName = localStorage.getItem('lastName');
    const creditFromStorage = localStorage.getItem('credit');
    this.location=localStorage.getItem('location');
    this.usercredit = creditFromStorage ? parseFloat(creditFromStorage) : 0; // Parse to float or set default value
    const userEmail = localStorage.getItem('email');
    this.fetchSavedData(1);
    this.getSavedRecordsCount();
    this.fetchSavedFilters();
  }

  getSavedRecordsCount() {
    this.getDataService.getsavedcount().subscribe(
      (res: any) => {
        console.log('Response from getSavedRecordsCount API:', res);
        this.saved_records = res.saved_records;
      },
      (error: any) => {
        console.error('Error fetching saved records count:', error);
      }
    );
  }

  fetchSavedData(page: number): void {
    this.getDataService.getSavedDataForUser(page).subscribe({
      next: (response: any) => {
        if (response && response.saved_data) {
          this.savedData = response.saved_data;
          this.total_records = response.pagination_saved.total_records;
          this.savedData.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          this.displayedData = this.savedData.slice(0, 5);
        } else {
          console.warn('Unexpected server response. No saved_data property found.');
        }
      },
      error: (error) => {
        console.error('Error fetching saved data:', error);
      },
    });
  }

  fetchSavedFilters(): void {
    this.getSavedFilters().subscribe(
      (filters: any[]) => {
        this.savedFilters = filters.filter(filter => {
          return filter.filter_name || 
                 filter.include_job_title || 
                 filter.include_country || 
                 filter.include_company_name || 
                 filter.include_city || 
                 filter.include_region || 
                 filter.exclude_company_domain || 
                 filter.exclude_company_name || 
                 filter.exclude_country || 
                 filter.include_Industry || 
                 filter.include_Zip_Code || 
                 filter.include_employee_size || 
                 filter.include_job_function || 
                 filter.include_job_level || 
                 filter.include_state;
        });
        console.log('Saved filters:', this.savedFilters);
      },
      (error: any) => {
        console.error('Error fetching saved filters:', error);
      }
    );
  }

  getSavedFilters(): Observable<any[]> {
    const api_key = this.authService.getapi_key();
    const Url = `https://api.datagateway.in/v1/search/people/getSaveFilter/?api=${api_key}`;

    return this.http.get<any[]>(Url);
  }

  formatDate(dateString: string): string {
    const currentDate = new Date();
    const date = new Date(dateString);

    const diffMs = currentDate.getTime() - date.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);

    const seconds = diffSeconds % 60;
    const minutes = Math.floor(diffSeconds / 60) % 60;
    const hours = Math.floor(diffSeconds / 3600) % 24;
    const days = Math.floor(diffSeconds / 86400);

    if (days > 0) {
      return days === 1 ? '1 d' : `${days}d`;
    } else if (hours > 0) {
      return hours === 1 ? '1 h' : `${hours}h`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 m' : `${minutes}m`;
    } else {
      return seconds <= 5 ? 'just now' : `${seconds}s`;
    }
  }

  toggleDetails(filter: any): void {
    filter.showDetails = !filter.showDetails;
  }

  toggleRecentActivity() {
    this.showRecentActivity = true;
    this.showSavedSearches = false;
  }

  toggleSavedSearches() {
    this.showRecentActivity = false;
    this.showSavedSearches = true;
  }

  calculateProgressWidth(): number {
    return this.usercredit ? (this.usercredit / 1000) * 100 : 0;
  }

  
  calculateRemainingCredits(): number {
    return 1000 - this.usercredit;
  }
  

  getCurrentTime(): string {
    const currentDate = new Date();
    return currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

    userContext = {
    name: 'Pummy Sinha',
    title: "Head Sales Enablement Group Portfolio",
    company: 'Capgemini',
    location: 'ON, Canada',
    industry: "IT Services and Consulting",
    businessType:"",
    subscriptionPlan:"Basic"
  };
 

  // emailContent: string = '';
  // generateEmail() {
  //   console.log("User Context Sent:", this.userContext); // Log to check if it's populated
  //   this.getDataService.generateEmail(this.userContext).subscribe(
  //     (response) => {
  //       console.log('Email Content Response:', response);  // Check if email content is returned correctly
  //       this.emailContent = response.emailContent;
  //     },
  //     (error) => {
  //       console.error('Error generating email:', error);
  //     }
  //   );
    
  // }
  selectedTemplate: any;
  jobTitle: string = '';
  companyName: string = '';
  personName: string = '';
  generatedEmail: string = '';


  generateEmail1(): void {
    this.getDataService.generateEmail2(this.jobTitle, this.companyName, this.personName).subscribe(
      response => {
        this.generatedEmail = response.email;
        console.log(this.generatedEmail,'this is the generated email')
      },
      error => {
        console.error('There was an error generating the email!', error);
      }
    );
  }
  generateEmail() {
    if (this.selectedTemplate === 'productOffering') {
      this.generatedEmail = this.generateProductOfferingEmail();
    } else if (this.selectedTemplate === 'professionalBackground') {
      this.generatedEmail = this.generateProfessionalBackgroundEmail();
    } else if (this.selectedTemplate === 'companyPriorities') {
      this.generatedEmail = this.generateCompanyPrioritiesEmail();
    } else {
      this.generatedEmail = 'Invalid template selected';
    }
  }

  // Method to generate email for product offering
  generateProductOfferingEmail(): string {
    return `Dear [Recipient Name],

Thank you for your interest in our products. We are happy to offer you a variety of options that fit your needs.
...`;

  }

  // Method to generate email for professional background
  generateProfessionalBackgroundEmail(): string {
    return `Dear [Recipient Name],

We have reviewed your professional background, and we believe our product could be a valuable addition to your workflow.
...`;
  }

  // Method to generate email for company priorities
  generateCompanyPrioritiesEmail(): string {
    return `Dear [Recipient Name],

We understand that your company is focusing on [Company Priorities], and we have a solution that aligns perfectly with your goals.
...`;
  }











}
