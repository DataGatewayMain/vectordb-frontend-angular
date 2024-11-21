import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { UserDetailsComponent } from '../mainpage/sidenavfolders/search/people/total/user-details/user-details.component';
import { ServiceForemailverificationService } from '../service-foremailverification.service';
import { AuthService } from '../auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as saveAs from 'file-saver';
import { JoyrideService } from 'ngx-joyride';
import { Subscription } from 'rxjs';
import { GuideComponent } from '../guide/guide.component';
import { FilterService } from '../mainpage/sidenavfolders/search/filters/filter.service';

@Component({
  selector: 'app-user-details-for-netnew',
  templateUrl: './user-details-for-netnew.component.html',
  styleUrls: ['./user-details-for-netnew.component.css']
})
export class UserDetailsForNetnewComponent {
  filters: any = {}; 
  userProspectLink: string = '';
  userDetails: any;
  selectedUserDetails: any;
  isLoading: boolean = true;
  progressValue: number = 0;
  results: any = [];
  currentPage: number = 1;
  loading = true;
  selectedRows: any[] = [];
  count:any
  dialogRef: any;
  userEmail: string = '';
  pagination: any = {};
  paginationTotal: any = {}; 
  recordsPerPage: number = 10; 
  totalPages: number = 0;
  emailVerification!: string;
  constructor(
    private route: ActivatedRoute,
    private apiService: GetDataService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UserDetailsComponent>,
    private snackbar:MatSnackBar,
    private emailVerificationService: ServiceForemailverificationService,
    private filterService: FilterService,
    private authService: AuthService 
  ) {

    this.route.paramMap.subscribe(params => {
      const prospectLink = params.get('prospectLink');
      // Now you can fetch user details based on the prospectLink
    });
  }
  userNotFoundError: boolean = false;
  ngOnInit(): void {

    
    this.userProspectLink = this.data.editData;
    this.startProgressBar();
    this.fetchAllDetailsForUser(this.userProspectLink);
    this.emailVerificationService.emailVerification$.subscribe((verification: string) => {
      this.emailVerification = verification;
    });

    
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
      this.startProgressBar();
      this.search();
    });

  
  }

  onUserNameClick(prospectLink: string): void {
    // Reset progress bar on user click
    this.progressValue = 0;
    this.startProgressBar();

    this.fetchAllDetailsForUser(prospectLink);
    console.log('this is the prospect link', prospectLink);
  }
  toggleValidation(item: any): void {
    item.loading = true; // Show loader
  
    // Simulate validation process, replace this with your actual validation logic
    setTimeout(() => {
      // Assuming validation is successful and the result is stored in item.email_validation
      item.showValidation = true;
      item.loading = false; // Hide loader
  
      // If email is valid, save data to user account
      if (item.email_validation) {
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
          const api_key = this.authService.getapi_key();
          const selectedRowId = item.Prospect_Link; // Assuming Prospect_Link is the selected row ID
  
          // Populate selectedRows array
          this.selectedRows = [item]; // Assuming only one item is selected at a time
  
          // Construct API URL
          const apiUrl = `https://api.vectordb.app/v1/search/people/savedata/?api=${api_key}&selectedRowIds[]=${selectedRowId}`;
  
          // Make request to save data
          this.apiService.saveDataToUserAccount(userEmail, this.selectedRows).subscribe(
            (response) => {
              
             this.snackbar.open('Email access successfully')
            },
            (error) => {
              // Handle error if needed
              console.error('Error saving data:', error);
            }
          );
        } else {
          console.error('User email not found.');
        }
      }
    }, 2000); // Simulate 2 seconds delay, adjust as needed
  }

  fetchAllDetailsForUser(userProspectLink: string): void {
    
    this.apiService.getAllDetailsForUser(userProspectLink).subscribe(
      (data) => {
        this.isLoading = false;
        this.selectedUserDetails = data; 
        console.log('User details: userdetails component', this.selectedUserDetails);
        if(this.selectedUserDetails?.error==='User not found'){
this.userNotFoundError=true
this.snackbar.open('user details not found','',{
  duration: 2000
})
        }
      },
    
        
      (error) => {
        console.error('Error fetching user details:', error);
        this.snackbar.open('user details not found')
       })
   }
  

  startProgressBar() {
    const interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 50; 
      } else {
        clearInterval(interval);
      }
    }, 1000); 
  }

  valitity: any;
  clicked: any;
  isEmailValid: any;
  showSelected: boolean = false;
  validationChecked: boolean = false;
  showButton: boolean = true;
  validateEmail(email: string, item: any): void {
    this.isLoading = true;
    this.apiService.getlastBounce(email).subscribe(
      (data) => {
        console.log(data.result, 'data of rebounce');
        this.isEmailValid = data.result;
        item.isValidEmail = data.result;
        item.clicked = true;
        // Store the verification status in localStorage
        localStorage.setItem(
          'emailVerification_' + email,
          JSON.stringify({ isValidEmail: data.result, clicked: true })
        );
        this.valitity = localStorage.getItem('isValidEmail');
        this.clicked = localStorage.getItem('clicked');
      },
      (error) => {
        console.error('Error validating email:', error);
        this.snackbar.open('Error occurred while validating email', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  }


  // Method to retrieve the stored validation status for an email from localStorage
  getStoredValidationStatus(email: string): string | null {
    const storedData = localStorage.getItem('emailVerification_' + email);
    if (storedData) {
      const { isValidEmail } = JSON.parse(storedData);
      return isValidEmail;
    }
    return null;
  }
  
  
  search(): void {
    this.loading = true;
    this.startProgressBar();
    const filtersApplied = Object.values(this.filters).some(
      (value) => value !== null && value !== undefined && value !== ''
    );
    console.log('Filters:', this.filters);

    if (!filtersApplied) {
      this.results = [];
      this.startProgressBar();
  
      this.selectedRows = [];
      return;
    }

    // this.apiService
    //   .searchRecords(this.filters, this.currentPage)
    //   .subscribe(
    //     (data: any) => {
    //       this.results = data.total_data;

    //     this.loading = false;
    //     this.count = data.total_count;
    //     this.isLoading = false;
    //       // this.pagination = this.results.pagination_;
    //     this.totalPages = data.pagination_total.total_pages_total;
    //     console.log('Data count', data.total_records);
    //     console.log('company link',this.results.Company_Link);
    //     console.log(this.results,'this result in userdetails');
        
       
    //     },
    //     (error) => {
    //       console.error('Error fetching data:', error);
    //       this.loading = false; 
    //       // Set loading to false on error
    //     }
    //   );
      
      
  }




}