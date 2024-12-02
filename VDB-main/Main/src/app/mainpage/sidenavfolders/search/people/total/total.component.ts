import { GetDataService } from '../get-data.service';
import { Component, Inject } from '@angular/core';
import saveAs from 'file-saver';
import { FilterService } from '../../filters/filter.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details/user-details.component';
import { Router } from '@angular/router';
import { FilterCompaniesService } from 'src/app/filter-companies/filter-companies.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoginComponent } from 'src/app/landingpage/login/login.component';
import { JoyrideService } from 'ngx-joyride';
import { GuideComponent } from 'src/app/guide/guide.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailValidator } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { EmaildialogueComponent } from 'src/app/emaildialogue/emaildialogue.component';
import { ServiceForemailverificationService } from 'src/app/service-foremailverification.service';
import { NewService } from 'src/app/new.service';
import { callback } from 'chart.js/dist/helpers/helpers.core';
import { DialogueSaveComponent } from 'src/app/dialogue-save/dialogue-save.component';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css'],
})
export class TotalComponent {
  filters: any = {};
  results: any = [];
  currentPage: number = 1;
  loading = true;
  selectedRows: any[] = [];
  count: any;
  // isLoading: boolean = true;
  selectedUserDetails?: any = null;
  dialogRef: any;
  progressValue: number = 0;
  userEmail: string = '';
  pagination: any = {};
  paginationTotal: any = {};
  recordsPerPage: number = 10;
  totalPages: number = 0;
  items: any;
  loader: any;
  isLoading: boolean = true;
  displayedData: any[] | undefined;
  itemsPerPage: number = 50;
  isExporting: boolean = false;
  isDialogOpen: boolean = false;
  isDialogOpenPhone: boolean = false;
  selectedEmail: string | null = null;
  isCopiedMessageVisible = false;
  selectedPhone: string | null = null;
  selectedRowId: number | null = null;
  originalResults: any[] = [];
  constructor(
    private apiService: GetDataService,
    private emailVerificationService: ServiceForemailverificationService,
    private readonly joyrideService: JoyrideService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private dialog: MatDialog,
    private router: Router,
    private loadingBar: LoadingBarService,
    private validationService: NewService
  ) {}
  ngOnInit(): void {
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
      this.startProgressBar();
      this.search();
    });
    this.saveDataToUserAccount();
    this.filters = this.retrieveFiltersFromLocal();
    this.fetchBuyingIntentData(1, this.filters);
  }

  onUserNameClick(prospectLink: string): void {
    this.fetchAllDetailsForUser(prospectLink);
  }

  fetchAllDetailsForUser(prospectLink: string): void {
    this.apiService.getAllDetailsForUser(prospectLink).subscribe(
      (data) => {
        this.selectedUserDetails = data.userDetails;
      },
      (error) => {}
    );
  }

  openUserDetails(prospectLink: string): void {
    // Navigate to the userDetails route with the prospectLink as a parameter
    this.router.navigate(['userDetails', prospectLink]);
  }

  saveData(): void {
    this.apiService.saveDataToUserAccount1(this.selectedRows).subscribe(
      (response) => {
        this.selectedRows = []; // Clear selected rows on successful save
        // Optionally, show success message or perform other actions
        this.snackBar.open('Data saved successfully', '', {
          duration: 1000,
        });
      },
      (error) => {
        if (error.status === 409) {
          // Handle duplicate entry error
        } else if (error.status === 500) {
          // Handle other server errors
        } else {
          // Handle other specific errors as needed
        }
      }
    );
  }
  removeCompanyName(): void {
    // Remove the company name filter
    this.filters.companyName = null;

    // Save updated filters to local storage
    this.saveFiltersToLocal();

    // Call search with resetPage: true to reset pagination and fetch new data
    this.search(true);
  }

  search(resetPage: boolean = true): void {
    this.loading = true;

    // Reset currentPage to 1 for a new search if resetPage is true
    if (resetPage) {
      this.currentPage = 1;
    }

    const filtersApplied = Object.values(this.filters).some(
      (value) => value !== null && value !== undefined && value !== ''
    );

    if (!filtersApplied) {
      this.results = [];
      this.progressValue = 0;
      this.startProgressBar();
      this.loading = false;
      this.selectedRows = [];
      return;
    }

    this.apiService.totalsearch(this.filters, this.currentPage).subscribe(
      (data: any) => {
        this.results = data.total_data;
        this.loading = false;
        this.count = data.total_count;
        this.totalPages = data.total_pages.total_pages_total;
        this.paginationTotal = this.calculatePaginationDetails(
          this.currentPage,
          data.total_count
        );
        this.saveFiltersToLocal();
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  // 29-10-24
  buyingIntentData: any;
  fetchBuyingIntentData(page: number, filters: any): void {
    this.apiService.getBuyingIntentData(page, filters).subscribe(
      (response) => {
        this.buyingIntentData = response;
      },
      (error) => {}
    );
  }
  jobChangesData: any[] = [];
  updatedCount: number = 0;
  updatedPids: any;
  fetchJobChanges() {
    this.apiService.jobChanges(this.filters).subscribe(
      (response) => {
        if (response) {
          this.updatedCount = response.updated_count;
          this.jobChangesData = response.updated_data;

          // Store the pids of updated records
          this.updatedPids = this.jobChangesData.map((item) => item.pid); // Assuming 'pid' is a property of the item
        }
      },
      (error) => {}
    );
  }

  defaultImage = './assets/company.svg'; // Default image path

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }
  getEmailAddress(item: any, job: any): string {
    if (this.comparePIDs(item, job)) {
      if (item.email_address !== job.email_address) {
        return job.email_address;
      }
    }
    return item.email_address;
  }

  getPid(item: any, job: any): string {
    if (this.comparePIDs(item, job)) {
      if (item.pid !== job.pid) {
        return job.pid;
      }
    }
    return item.pid;
  }

  getCompanyDomain(item: any, job: any): string {
    if (this.comparePIDs(item, job)) {
      if (item.company_domain !== job.company_domain) {
        return job.company_domain;
      }
    }
    return item.company_domain;
  }

  getJobTitle(item: any, job: any): string {
    if (this.comparePIDs(item, job)) {
      if (item.job_title !== job.job_title) {
        return job.job_title;
      }
    }
    return item.job_title;
  }
  getDisplayedPid(item: any): string | void {
    for (const job of this.jobChangesData) {
      if (this.getPid(item, job)) {
        return this.getPid(item, job);
      }
    }
    // No return statement when no match is found
  }

  getDisplayedCompanyDomain(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getCompanyDomain(item, job)) {
        foundMatch = true;
        return this.getCompanyDomain(item, job); // Return the job title if found
      }
    }
    return item.company_domain; // Return item.job_title if no match found
  }

  getDisplayedJobTitle(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.comparePIDs(item, job)) {
        foundMatch = true;
        return this.getJobTitle(item, job); // Return the job title if found
      }
    }
    return item.job_title; // Return item.job_title if no match found
  }

  getDisplayedEmailAddress(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getEmailAddress(item, job)) {
        foundMatch = true;
        return this.getEmailAddress(item, job); // Return the job title if found
      }
    }
    return item.email_address; // Return item.job_title if no match found
  }

  comparePIDs(item: any, job: any): boolean {
    return item.pid === job.pid;
  }

  getCompanyName(item: any, job: any): string {
    if (this.comparePIDs(item, job)) {
      if (item.company_name !== job.company_name) {
        return job.company_name;
      }
    }
    return item.company_name;
  }
  getDisplayedCompanyName(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getCompanyName(item, job)) {
        foundMatch = true;
        return this.getCompanyName(item, job); // Return the job title if found
      }
    }
    return item.company_name; // Return item.job_title if no match found
  }

  sortCriteria: string = '';
  sortOrder: string = 'Ascending';

  onSortCriteriaChange(event: any) {
    this.sortCriteria = event.target.value;
    this.sortData();
  }

  onSortOrderChange(event: any) {
    this.sortOrder = event.target.value;
    this.sortData();
  }

  sortData() {
    switch (this.sortCriteria) {
      case 'Relevance':
        this.sortByRelevance();
        break;
      case 'Name':
        this.sortByName();
        break;
      case 'Company':
        this.sortByCompany();
        break;
      case 'Location':
        this.sortByLocation();
        break;
      case 'City':
        this.sortByCity();
        break;
      case 'Industry':
        this.sortByIndustry();
        break;
      case 'Employees':
        this.sortByEmployees();
        break;
      default:
        break;
    }
  }
  sortByRelevance() {
    // Show the default table order
    this.results = [...this.originalResults];
  }
  sortByName() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return this.sortOrder === 'Ascending'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  sortByCompany() {
    this.results.sort((a: any, b: any) => {
      const companyA = a.company_name ? a.company_name : '';
      const companyB = b.company_name ? b.company_name : '';
      return this.sortOrder === 'Ascending'
        ? companyA.localeCompare(companyB)
        : companyB.localeCompare(companyA);
    });
  }

  sortByLocation() {
    this.results.sort((a: any, b: any) => {
      const combinedA = `${a.country || ''} ${a.city || ''}`.trim();
      const combinedB = `${b.country || ''} ${b.city || ''}`.trim();
      return this.sortOrder === 'Ascending'
        ? combinedA.localeCompare(combinedB)
        : combinedB.localeCompare(combinedA);
    });
  }

  sortByCity() {
    this.results.sort((a: any, b: any) => {
      const cityA = a.city ? a.city : '';
      const cityB = b.city ? b.city : '';
      return this.sortOrder === 'Ascending'
        ? cityA.localeCompare(cityB)
        : cityB.localeCompare(cityA);
    });
  }

  sortByIndustry() {
    this.results.sort((a: any, b: any) => {
      const industryA = a.industry ? a.industry : '';
      const industryB = b.industry ? b.industry : '';
      return this.sortOrder === 'Ascending'
        ? industryA.localeCompare(industryB)
        : industryB.localeCompare(industryA);
    });
  }

  sortByEmployees() {
    this.results.sort((a: any, b: any) => {
      const industryA = a.employee_size ? a.employee_size : '';
      const industryB = b.employee_size ? b.employee_size : '';
      return this.sortOrder === 'Ascending'
        ? industryA.localeCompare(industryB)
        : industryB.localeCompare(industryA);
    });
  }

  //  ?****************************
  sortByNameAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByNameDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return nameB.localeCompare(nameA);
    });
  }

  sortByCompanyAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.company_name ? a.company_name : '';
      const nameB = b.company_name ? b.company_name : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByCompanyDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.company_name ? a.company_name : '';
      const nameB = b.company_name ? b.company_name : '';
      return nameB.localeCompare(nameA);
    });
  }

  sortByEmailAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.email_address ? a.email_address : '';
      const nameB = b.email_address ? b.email_address : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByEmailDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.email_address ? a.email_address : '';
      const nameB = b.email_address ? b.email_address : '';
      return nameB.localeCompare(nameA);
    });
  }
  sortByTitleAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.job_title ? a.job_title : '';
      const nameB = b.job_title ? b.job_title : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByTitleDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.job_title ? a.job_title : '';
      const nameB = b.job_title ? b.job_title : '';
      return nameB.localeCompare(nameA);
    });
  }

  sortByCountryCityAsc() {
    this.results.sort((a: any, b: any) => {
      const combinedA = `${a.country || ''} ${a.city || ''}`.trim();
      const combinedB = `${b.country || ''} ${b.city || ''}`.trim();
      return combinedA.localeCompare(combinedB);
    });
  }

  sortByCountryCityDesc() {
    this.results.sort((a: any, b: any) => {
      const combinedA = `${a.country || ''} ${a.city || ''}`.trim();
      const combinedB = `${b.country || ''} ${b.city || ''}`.trim();
      return combinedB.localeCompare(combinedA);
    });
  }

  sortByemployee_sizeAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.employee_size ? a.employee_size : '';
      const nameB = b.employee_size ? b.employee_size : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByemployee_sizeDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.employee_size ? a.employee_size : '';
      const nameB = b.employee_size ? b.employee_size : '';
      return nameB.localeCompare(nameA);
    });
  }

  sortByindustryAsc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.industry ? a.industry : '';
      const nameB = b.industry ? b.industry : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortByindustryDesc() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.industry ? a.industry : '';
      const nameB = b.industry ? b.industry : '';
      return nameB.localeCompare(nameA);
    });
  }

  // Function to save filters to local storage
  saveFiltersToLocal(): void {
    localStorage.setItem('appliedFilters', JSON.stringify(this.filters));
  }

  // Function to retrieve filters from local storage
  retrieveFiltersFromLocal(): any {
    const storedFilters = localStorage.getItem('appliedFilters');
    return storedFilters ? JSON.parse(storedFilters) : {};
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
      this.search(false); // Don't reset the page when navigating
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      this.currentPage - Math.floor(maxVisiblePages / 2),
      1
    );
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
      (selectedRow) => selectedRow.prospect_link === row.prospect_link
    );

    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  get selectedRowsCount(): number {
    return this.selectedRows.length;
  }
  get startRecord(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.count);
  }

  get totalRecords(): number {
    return this.count;
  }
  isRowSelected(row: any): boolean {
    return this.selectedRows.some(
      (selectedRow) => selectedRow.prospect_link === row.prospect_link
    );
  }
  exportToCSV(): void {
    const api_key = localStorage.getItem('api_key');
    if (api_key) {
      const filters = this.filters;
      const selectedRows = this.selectedRows;

      this.apiService.exportToCSV(filters, selectedRows).subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
          saveAs(blob, 'exported_data.csv');
          this.snackBar.open('Data has been exported', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['custom-snackbar', 'snackbar-success'],
          });
        },
        (error) => {}
      );
    } else {
    }
  }

  saveDataToUserAccount(): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.apiService
        .saveDataToUserAccount(userEmail, this.selectedRows)
        .subscribe(
          (response) => {
            this.selectedRows = [];
            this.snackBar.open('record save ', 'Close', {
              duration: 2000,
            });
          },
          (error) => {
            if (error.status === 501) {
            } else if (error.status === 409) {
              this.snackBar.open('Already saved record', 'Close', {
                duration: 1000,
              });
            }
          }
        );
    } else {
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
      height: '100%',
      width: '450px',
      position: { right: '0px', top: '320px', bottom: '100px' },
    });
  }
  exportData(dataToExport: any[]): void {
    const filters = this.filters;
    this.apiService.exportToCSV(filters, dataToExport).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'exported_data.csv');
        this.snackBar.open('Data has been exported', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-success'],
        });
      },
      (error) => {
        this.snackBar.open('Error exporting data', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  }

  openExportDialogue(): void {
    if (this.selectedRows.length === 0) {
      return; // Prevent further action if no rows are selected
    }

    const unsavedRows = this.selectedRows.filter((row) => !row.saved);

    if (unsavedRows.length > 0) {
      const dialogRef = this.dialog.open(DialogueSaveComponent, {
        data: { selectedRows: unsavedRows },
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.exportData(this.selectedRows);
        }
      });
    } else {
      this.exportData(this.selectedRows);
    }
  }

  startProgressBar() {
    const interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 50;
      } else {
        clearInterval(interval);
        // callback(); // Execute the callback function when progress reaches 100%
      }
    }, 1000);
  }

  openGuideDialog() {
    let dialogRef = this.dialog.open(GuideComponent, {
      data: {},
      height: '500px',
      width: '450px',
      position: { right: '0px', top: '90px', bottom: '0px' },
    });
  }

  localStorage = localStorage;
  valitity: any;
  clicked: any;
  isEmailValid: any;
  showSelected: boolean = false;
  validationChecked: boolean = false;
  showButton: boolean = true;

  validateEmail(email: string, item: any): void {
    this.apiService.getlastBounce(email).subscribe(
      (data) => {
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
        this.showResult = true;
      },
      (error: any) => {
        this.snackBar.open('Error occurred while validating email', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  }

  // Method to retrieve the stored validation status for an email from localStorage
  // getStoredValidationStatus(email: string): string | null {
  //   const storedData = localStorage.getItem('emailVerification_' + email);
  //   if (storedData) {
  //     const { isValidEmail } = JSON.parse(storedData);
  //     return isValidEmail;
  //   }
  //   return 'VALID'
  // }
  showResult: boolean = false;
  status!: string;
  buttonClicked: boolean = false;

  toggleDialog(rowId: number, email: string): void {
    if (
      this.selectedRowId === rowId &&
      this.selectedEmail === email &&
      this.isDialogOpen
    ) {
      this.isDialogOpen = false;
      this.selectedEmail = null;
      this.selectedRowId = null;
    } else {
      this.isDialogOpen = true;
      this.selectedEmail = email;
      this.selectedRowId = rowId;
      // Ensure phone dialog is closed
      this.isDialogOpenPhone = false;
      this.selectedPhone = null;
    }
  }

  togglePhoneDialog(rowId: number, phone: string): void {
    if (
      this.selectedRowId === rowId &&
      this.selectedPhone === phone &&
      this.isDialogOpenPhone
    ) {
      this.isDialogOpenPhone = false;
      this.selectedPhone = null;
      this.selectedRowId = null;
    } else {
      this.isDialogOpenPhone = true;
      this.selectedPhone = phone;
      this.selectedRowId = rowId;
      // Ensure email dialog is closed
      this.isDialogOpen = false;
      this.selectedEmail = null;
    }
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.isCopiedMessageVisible = true;
          setTimeout(() => {
            this.isCopiedMessageVisible = false;
          }, 2000);
        })
        .catch((err) => {
          alert('Failed to copy text.');
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.isCopiedMessageVisible = true;
        setTimeout(() => {
          this.isCopiedMessageVisible = false;
        }, 2000);
      } catch (err) {
        alert('Failed to copy text.');
      }
      document.body.removeChild(textArea);
    }
  }
  isSelected(): boolean {
    return this.selectedRows.length > 0;
  }
}
