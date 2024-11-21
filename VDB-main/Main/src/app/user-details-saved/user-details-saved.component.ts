import { ChangeDetectorRef, Component, Inject } from '@angular/core';
// import { GetDataService } from '../../get-data.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceForemailverificationService } from 'src/app/service-foremailverification.service';
// import { FilterService } from 'primeng/api';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { FilterService } from 'primeng/api';
// import { FilterService } from '../../../filters/filter.service';

@Component({
  selector: 'app-user-details-saved',
  templateUrl: './user-details-saved.component.html',
  styleUrls: ['./user-details-saved.component.css']
})
export class UserDetailsSavedComponent {
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
  filterService: any;
  showEmail: boolean = false;
  showPhone: boolean = false;

  toggleEmail() {
    this.showEmail = !this.showEmail;
  }

  togglePhone() {
    this.showPhone = !this.showPhone;
  }

  copyToClipboard(text: string) {
    // Implementation to copy text to clipboard
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: GetDataService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private ref: MatDialogRef<UserDetailsComponent>,
    private snackbar:MatSnackBar,
    private emailVerificationService: ServiceForemailverificationService,
    private filter: FilterService
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

    
    this.filterService.filters$.subscribe((filters:any) => {
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

  fetchAllDetailsForUser(userProspectLink: string): void {
    
    this.apiService.getAllDetailsForUser(userProspectLink).subscribe(
      (data:any) => {
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
    
        
      (error:any) => {
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
      (data:any) => {
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
      (error:any) => {
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
    //     (error:any) => {
    //       console.error('Error fetching data:', error);
    //       this.loading = false; 
    //       // Set loading to false on error
    //     }
    //   );
      
      
  }

 



}