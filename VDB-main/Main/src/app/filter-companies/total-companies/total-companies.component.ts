import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { FilterService } from 'src/app/mainpage/sidenavfolders/search/filters/filter.service';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import { UserDetailsComponent } from 'src/app/mainpage/sidenavfolders/search/people/total/user-details/user-details.component';
import { FilterCompaniesService } from '../filter-companies.service';
import saveAs from 'file-saver';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { JoyrideService } from 'ngx-joyride';
import { GuideComponent } from 'src/app/guide/guide.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceForemailverificationService } from 'src/app/service-foremailverification.service';
@Component({
  selector: 'app-total-companies',
  templateUrl: './total-companies.component.html',
  styleUrls: ['./total-companies.component.css']
})
export class TotalCompaniesComponent {
  filters: any = {};
  results: any = [];
  currentPage: number = 1;
  loading = true;
  selectedRows: any[] = [];
  count: any;
  isLoading: boolean = true;
  selectedUserDetails?: any = null;
  dialogRef: any;
  progressValue: number = 0;
  userEmail: string = '';
  pagination: any = {};
  paginationTotal: any = {};
  recordsPerPage: number = 10;
  totalPages: number = 0;
  items: any;
  constructor(
    private apiService: GetDataService,
    private emailVerificationService: ServiceForemailverificationService,
    private readonly joyrideService: JoyrideService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private dialog: MatDialog,
    private router: Router,
    private loadingBar: LoadingBarService
  ) {}
  ngOnInit(): void {
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
      this.startProgressBar();
      this.search();
    });
    // this.saveDataToUserAccount();
    this.search();

  }

  onUserNameClick(prospectLink: string): void {
    this.fetchAllDetailsForUser(prospectLink);
  }

  fetchAllDetailsForUser(prospectLink: string): void {
    this.apiService.getAllDetailsForUser(prospectLink).subscribe(
      (data) => {
        this.selectedUserDetails = data.userDetails;
        console.log('User details:total component', this.selectedUserDetails);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  openUserDetails(prospectLink: string): void {
    // Navigate to the userDetails route with the prospectLink as a parameter
    this.router.navigate(['userDetails', prospectLink]);
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

    // this.apiService.searchRecords(this.filters, this.currentPage).subscribe(
    //   (data: any) => {
    //     this.results = data.total_data;

    //     this.loading = false;
    //     this.count = data.total_count;
    //     this.isLoading = false;
    //     // this.pagination = this.results.pagination_;
    //     this.totalPages = data.pagination_total.total_pages_total;
    //     console.log('Data count', data.total_records);
    //     console.log('company link', this.results.Company_Link);
    //     console.log(this.results, 'this result');

    //     this.paginationTotal = this.calculatePaginationDetails(
    //       this.currentPage,
    //       data.total_count
    //     );
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //     this.loading = false;
    //     // Set loading to false on error
    //   }
    // );
  }
  calculatePaginationDetails(currentPage: number, totalItems: number): any {
    const totalPages = Math.ceil(totalItems / this.recordsPerPage);
  
    return {
      current_page_total: currentPage,
      total_pages_total: totalPages,
      records_per_page_total: this.recordsPerPage,
    };
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.search();
    }
  }
  
  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(this.currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;
  
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
  
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
  
    return pages;
  }
  
  toggleRowSelection(row: any): void {
    const index = this.selectedRows.findIndex(
      (selectedRow) => selectedRow.Prospect_Link === row.Prospect_Link
    );
  
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }
  isRowSelected(row: any): boolean {
    return this.selectedRows.some(
      (selectedRow) => selectedRow.Prospect_Link === row.Prospect_Link
    );
  }
  exportToCSV(): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      const filters = this.filters;
      const selectedRows = this.selectedRows;

      const params = {
        ...filters,
        export: 'csv',
        selectedIds: JSON.stringify(
          selectedRows.map((row) => row.Prospect_Link)
        ),
        dynamic_table: userEmail,
      };

      this.apiService.exportToCSV(filters, selectedRows).subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
          saveAs(blob, 'exported_data.csv');
          this.snackBar.open('data is exported', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['custom-snackbar', 'snackbar-success'],
          });
        },
        (error) => {
          console.error('Error exporting data:', error);
        }
      );
    } else {
      console.error('User email not found.');
    }
  }

  saveDataToUserAccount(): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.apiService
        .saveDataToUserAccount(userEmail, this.selectedRows)
        .subscribe(
          (response) => {
            console.log('Data saved successfully:', response);

            this.selectedRows = [];
          },
          (error) => {
            if (error.status === 501) {
              console.error('Connection failed', error);
            } else if (error.status === 409) {
              this.snackBar.open('Already saved record', 'Close', {
                duration: 4000,
                verticalPosition: 'top',
                panelClass: 'my-custom-snackbar',
              });
            }
          }
        );
    } else {
      console.error('User email not found.');
    }
  }

  selectAllChecked: boolean = false;

  selectAllRows(): void {
    this.selectAllChecked = !this.selectAllChecked;

    if (this.selectAllChecked) {
      this.selectedRows = [...this.results];
    } else {
      this.selectedRows = [];
    }
  }

  openUserDialog(editData: any) {
    let dialogRef = this.dialog.open(UserDetailsComponent, {
      data: { editData },
      height: '500px',
      width: '450px',
      position: { right: '0px', top: '320px', bottom: '100px' },
    });
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
  openGuideDialog() {
    let dialogRef = this.dialog.open(GuideComponent, {
      data: {},
      height: '1000px',
      width: '450px',
      position: { right: '0px', top: '90px', bottom: '0px' },
    });
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
        this.snackBar.open('Error occurred while validating email', 'Close', {
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
}
