import { Component, HostListener, OnInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsForSavedComponent } from 'src/app/user-details-for-saved/user-details-for-saved.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import saveAs from 'file-saver';
import { EmailDialogComponent } from 'src/app/email-dialog/email-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { InboxEmailComponent } from 'src/app/inbox-email/inbox-email.component';
import { ChangeDetectorRef } from '@angular/core';
import { BulkInboxEmailComponent } from 'src/app/bulk-inbox-email/bulk-inbox-email.component';
import { CommonModule } from '@angular/common';
import { FilterService } from 'primeng/api';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';

interface ResultItem {
  id: number;
  updated: string;
  emailStatus: boolean;
  companyStatus: boolean;
  jobTitleStatus: boolean;
  saved: boolean;
  pid: string;
  first_name: string;
  last_name: string;
  email_address: string;
  company_name: string;
  company_domain: string;
  job_title: string;
  job_function: string;
  job_level: string;
  company_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  telephone_number: string;
  employee_size: number;
  industry: string;
  revenue: number;
  sic: string;
  naic: string;
  company_link: string;
  prospect_link: string;
  email_validation: string;
  headquarter_address: string;
  head_city: string;
  head_state: string;
  campaign_id: number;
  api: string;
  region: string;
  maskedEmail?: string; // Optional, since it might be added later
}

@Component({
  selector: 'app-catagory-data-enrichment',
  standalone: true,
  imports: [CommonModule, RouterModule],  // Add CommonModule to imports
  templateUrl: './catagory-data-enrichment.component.html',
  styleUrl: './catagory-data-enrichment.component.css'
})
export class CatagoryDataEnrichmentComponent implements OnInit {
  savedData: any[] = [];
  savedRecordsCount: number = 0;
  selectedRows: any[] = [];
  selectAllChecked: boolean = false;
  filters: any = {};
  results: any = [];
  currentPage: number = 1;
  loading = true;
  count: any;
  total_records = 0;
  isLoading: boolean = true;
  progressValue: number = 0;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  paginationTotal: any = {};
  recordsPerPage: number = 10;
  snackBar: any;
  displayedData: any[] | undefined;
  isExporting: boolean = false;
  isDialogOpen: boolean = false;
  isDialogOpenPhone: boolean = false;
  selectedEmail: string | null = null;
  isCopiedMessageVisible = false;
  selectedPhone: string | null = null;
  selectedRowId: number | null = null;
  cdr: any;
  emailStatus: boolean | undefined;
  companyStatus: boolean | undefined;
  jobTitleStatus: boolean | undefined;

  constructor(private router: Router, private filterService: FilterService,private authService: AuthService, private apiService: GetDataService, private getDataService: GetDataService, private dialog: MatDialog, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.currentPage = 1;
    // Initialize filters from local storage or default values
    this.filters = this.retrieveFiltersFromLocal();
    this.search();
  }

  get selectedRowsCount(): number {
    return this.selectedRows.length;
  }

  calculatePaginationDetails(currentPage: number, totalItems: number): any {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    return {
      current_page_saved: currentPage,
      total_pages_saved: totalPages,
      records_per_page_saved: this.itemsPerPage,
    };
  }
  retrieveFiltersFromLocal(): any {
    const storedFilters = localStorage.getItem('appliedFilters');
    return storedFilters ? JSON.parse(storedFilters) : {};
  }
 

  search(): void {
    this.loading = true;
    this.selectedRows = [];
    
    this.apiService.savedsearch(this.filters, this.currentPage).subscribe(
      (data: any) => {
        this.results = data.saved_data || [];
        this.loading = false;
        this.count = data.saved_count || 0;
  
        if (data.saved_pagination) {
          this.totalPages = data.saved_pagination.total_pages_saved || 0;
        } else {
          console.error('Pagination data missing from backend response.');
          this.totalPages = 0;
        }
  
        // Apply the filter to the results
        this.filterResults();
  
        // Apply pagination
        this.paginateResults();
  
        this.saveFiltersToLocal();
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }
  
  
  filterResults(): void {
    this.results = this.results.filter((item: ResultItem) => 
      item.emailStatus === false || 
      item.companyStatus === false || 
      item.jobTitleStatus === false
    );
  }
  paginateResults(): void {
    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    this.displayedData = this.results.slice(start, end);
  }
    
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateResults();
    }
  }
  
  
  
  
  
  startProgressBar() {
    throw new Error('Method not implemented.');
  }
  saveFiltersToLocal() {
    throw new Error('Method not implemented.');
  }

  getPages(): number[] {
    // Return an array of page numbers based on totalPages
    if (this.totalPages <= 1) {
      return [1]; // Single page, return an array with only page 1
    }
    
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  
  

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return; // Ignore out-of-range page numbers
    }
    this.currentPage = page;
    this.search(); // Fetch data for the selected page
  }
  
  
  
  
  

  toggleRowSelection(row: any): void {
    const index = this.selectedRows.findIndex(
      (selectedRow) => selectedRow.id === row.id
    );
  
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }
  

  isRowSelected(row: any): boolean {
    return this.selectedRows.some(
      (selectedRow) => selectedRow.id === row.id
    );
  }

  selectAllRows(): void {
    this.selectAllChecked = !this.selectAllChecked;

    if (this.selectAllChecked) {
      this.selectedRows = [...this.results];
    } else {
      this.selectedRows = [];
    }
  }

  exportToCSV(exportAll: boolean = false): void {
   

    const api_key = this.authService.getapi_key();

    if (exportAll) {
      this.isExporting = true; // Start showing spinner
      this.fetchAllData().then((allData) => {
        this.isExporting = false; // Stop showing spinner
        this.exportData(allData);
      }).catch((error) => {
        this.isExporting = false; // Stop showing spinner
        console.error('Error fetching all data for export:', error);
        this.snackBar.open('Error exporting data', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      });
    } else {
      if (this.selectedRows.length === 0) {
        this.snackBar.open('No rows selected for export', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-warning'],
        });
        return;
      }
      this.exportData(this.selectedRows);
    }
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
        console.error('Error exporting data:', error);
        this.snackBar.open('Error exporting data', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  }
    getDataForCurrentPage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.savedData.length);
    this.displayedData = this.savedData.slice(startIndex, endIndex);
    
   
  }
  openUserDialog(editData: any) {
    let dialogRef = this.dialog.open(UserDetailsForSavedComponent, {
      data: { editData },
      height: '100%',
      width: '450px',
      position: { right: '0px', top: '320px', bottom: '100px' },
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
    this.getDataService.getlastBounce(email).subscribe(
      (data) => {
        
        this.isEmailValid = data.result;
        item.isValidEmail = data.result;
        item.clicked = true;
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
  getStoredValidationStatus(email: string): string | null {
    const storedData = localStorage.getItem('emailVerification_' + email);
    if (storedData) {
      const { isValidEmail } = JSON.parse(storedData);
      return isValidEmail;
    }
    return null;
  }
  fetchAllData(): Promise<any[]> {
    const allData: any[] = [];
    const totalPages = this.totalPages; 
    const fetchPageData = (page: number): Promise<any> => {
      return this.apiService.savedsearch(this.filters, page).toPromise();
    };
    const fetchAllPages = async () => {
      for (let page = 1; page <= totalPages; page++) {
        const data = await fetchPageData(page);
        allData.push(...data.saved_data);
      }
    };
    return new Promise((resolve, reject) => {
      fetchAllPages()
        .then(() => resolve(allData))
        .catch((error) => reject(error));
    });
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

  toggleDialog(rowId: number, email: string): void {
    if (this.selectedRowId === rowId && this.selectedEmail === email && this.isDialogOpen) {
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
    if (this.selectedRowId === rowId && this.selectedPhone === phone && this.isDialogOpenPhone) {
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
  
  disableCopy: boolean = false;
  copyToClipboard(text: string): void {

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {

        this.isCopiedMessageVisible = true;
        setTimeout(() => {
          this.isCopiedMessageVisible = false;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
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
        console.error('Fallback: Failed to copy: ', err);
        alert('Failed to copy text.');
      }
      document.body.removeChild(textArea);
    }
  }


  sendEmail(email: string, firstName: string, lastName: string): void {
    const dialogRef = this.dialog.open(InboxEmailComponent, {
      width: '500px',
      height: '700px ',
      data: { email: email, first_name: firstName, last_name: lastName },
      position: { right: '100px' ,bottom:'0px'} // Aligns the dialog to the right side
    });
  
    dialogRef.afterClosed().subscribe(result => {
      
      // Handle any actions after the dialog is closed
    });
  }

  defaultImage = './assets/company.svg'; // Default image path

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }
  maskEmail(email: string): string {
    const shouldMask = !this.emailStatus || !this.companyStatus || !this.jobTitleStatus;
    
    if (shouldMask) {
      const [localPart, domainPart] = email.split('@');
      
      if (localPart && domainPart) {
        // Mask the local part
        const localMasked = localPart.length > 4 
          ? localPart.slice(0, 4) + '******'
          : '****' + localPart.slice(1);
  
        // Mask the domain part
        const [domainName, domainExtension] = domainPart.split('.');
  
        // If the domain does not have a dot, mask the entire domain
        const domainMasked = domainName.length > 4
          ? '*****' + (domainExtension ? '.' + domainExtension : '')
          : '****' + (domainExtension ? '.' + domainExtension : '');
  
        return `${localMasked}@${domainMasked}`;
      }
    }
  
    return email;
  }
  
  selectedEmails: string[] = [];
  openBulkEmailDialog(): void {
    if (this.selectedRows.length === 0) {
      console.warn('No rows selected.');
      return;
    }
  
    const dialogRef = this.dialog.open(BulkInboxEmailComponent, {
      data: { recipients: this.selectedRows.map(row => row.email_address) }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
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
  originalResults: any[] = [];
  sortByRelevance() {
    // Show the default table order
    this.results = [...this.originalResults];
    console.log('Sorting by relevance');
  }
  sortByName() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return this.sortOrder === 'Ascending' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  sortByCompany() {
    this.results.sort((a: any, b: any) => {
      const companyA = a.company_name ? a.company_name : '';
      const companyB = b.company_name ? b.company_name : '';
      return this.sortOrder === 'Ascending' ? companyA.localeCompare(companyB) : companyB.localeCompare(companyA);
    });
  }

  sortByLocation() {
    this.results.sort((a: any, b: any) => {
      const combinedA = `${a.country || ''} ${a.city || ''}`.trim();
      const combinedB = `${b.country || ''} ${b.city || ''}`.trim();
      return this.sortOrder === 'Ascending' ? combinedA.localeCompare(combinedB) : combinedB.localeCompare(combinedA);
    });
  }

  sortByCity() {
    this.results.sort((a: any, b: any) => {
      const cityA = a.city ? a.city : '';
      const cityB = b.city ? b.city : '';
      return this.sortOrder === 'Ascending' ? cityA.localeCompare(cityB) : cityB.localeCompare(cityA);
    });
  }

  sortByIndustry() {
    this.results.sort((a: any, b: any) => {
      const industryA = a.industry ? a.industry : '';
      const industryB = b.industry ? b.industry : '';
      return this.sortOrder === 'Ascending' ? industryA.localeCompare(industryB) : industryB.localeCompare(industryA);
    });
  }

  sortByEmployees() {
    this.results.sort((a: any, b: any) => {
      const industryA = a.employee_size ? a.employee_size : '';
      const industryB = b.employee_size ? b.employee_size : '';
      return this.sortOrder === 'Ascending' ? industryA.localeCompare(industryB) : industryB.localeCompare(industryA);
    });
  }


//  ?****************************
  sortByNameAsc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByNameDesc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.first_name ? a.first_name : '';
      const nameB = b.first_name ? b.first_name : '';
      return nameB.localeCompare(nameA);
    });
  }
  

  sortByCompanyAsc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.company_name ? a.company_name : '';
      const nameB = b.company_name ? b.company_name : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByCompanyDesc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.company_name ? a.company_name : '';
      const nameB = b.company_name ? b.company_name : '';
      return nameB.localeCompare(nameA);
    });
  }

  sortByEmailAsc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.email_address ? a.email_address : '';
      const nameB = b.email_address ? b.email_address : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByEmailDesc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.email_address ? a.email_address : '';
      const nameB = b.email_address ? b.email_address : '';
      return nameB.localeCompare(nameA);
    });
  }
  sortByTitleAsc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.job_title ? a.job_title : '';
      const nameB = b.job_title ? b.job_title : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByTitleDesc() {
    this.results.sort((a:any, b:any) => {
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
    this.results.sort((a:any, b:any) => {
      const nameA = a.employee_size ? a.employee_size : '';
      const nameB = b.employee_size ? b.employee_size : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByemployee_sizeDesc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.employee_size ? a.employee_size : '';
      const nameB = b.employee_size ? b.employee_size : '';
      return nameB.localeCompare(nameA);
    });
  }


  sortByindustryAsc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.industry ? a.industry : '';
      const nameB = b.industry ? b.industry : '';
      return nameA.localeCompare(nameB);
    });
  }
  
  sortByindustryDesc() {
    this.results.sort((a:any, b:any) => {
      const nameA = a.industry ? a.industry : '';
      const nameB = b.industry ? b.industry : '';
      return nameB.localeCompare(nameA);
    });
  }

  onCallHQ(item: any) {
    this.isLoading = false;
  
    if (item && item.telephone_number) {
      let phoneNumber = item.telephone_number;
  
      // Check if country is available and prefix the telephone number with the country code
      if (item.country) {
        const country = this.countriesWithCallingCodes.find(c => c.country.toLowerCase() === item.country.toLowerCase());
        if (country) {
          const countryCode = country.code; // e.g., +1
          const countryCodeDigits = countryCode.replace('+', ''); // e.g., 1
  
          // Remove the leading '+' if it exists
          let normalizedPhoneNumber = phoneNumber.replace(/^\+/, '');
  
          // Check if the normalized phone number starts with the country code digits
          if (!normalizedPhoneNumber.startsWith(countryCodeDigits)) {
            // If not, prepend the country code to the phone number
            phoneNumber = countryCode + normalizedPhoneNumber;
          }
        } else {
          // Country not found, handle the case where country is not in the list
          alert('Country not found in the calling code list. Using the number as is.');
        }
      }
  
      // Debugging: Print the phone number to ensure it is correctly formatted
      console.log('Formatted phone number:', phoneNumber);
  
      const primaryNumber = '+14156306322'; // Replace with your Twilio phone number
  
      this.apiService.makeCall(primaryNumber, phoneNumber).subscribe(
        response => {
          this.isLoading = true;
          console.log('Call initiated:', response);
          // Show the response in an alert box
          alert('Call initiated successfully!\nCall SID: ' + response.callSid);
        },
        error => {
          this.isLoading = true;
          console.error('Error initiating call:', error);
          // Show the error in an alert box
          alert('Error initiating call:\n' + (error.error?.message || 'An unknown error occurred'));
        }
      );
    }
  }

  countriesWithCallingCodes = [
    { country: "Afghanistan", code: "+93" },
    { country: "Albania", code: "+355" },
    { country: "Algeria", code: "+213" },
    { country: "Andorra", code: "+376" },
    { country: "Angola", code: "+244" },
    { country: "Antigua and Barbuda", code: "+1-268" },
    { country: "Argentina", code: "+54" },
    { country: "Armenia", code: "+374" },
    { country: "Australia", code: "+61" },
    { country: "Austria", code: "+43" },
    { country: "Azerbaijan", code: "+994" },
    { country: "Bahamas", code: "+1-242" },
    { country: "Bahrain", code: "+973" },
    { country: "Bangladesh", code: "+880" },
    { country: "Barbados", code: "+1-246" },
    { country: "Belarus", code: "+375" },
    { country: "Belgium", code: "+32" },
    { country: "Belize", code: "+501" },
    { country: "Benin", code: "+229" },
    { country: "Bhutan", code: "+975" },
    { country: "Bolivia", code: "+591" },
    { country: "Bosnia and Herzegovina", code: "+387" },
    { country: "Botswana", code: "+267" },
    { country: "Brazil", code: "+55" },
    { country: "Brunei Darussalam", code: "+673" },
    { country: "Bulgaria", code: "+359" },
    { country: "Burkina Faso", code: "+226" },
    { country: "Burundi", code: "+257" },
    { country: "Cabo Verde", code: "+238" },
    { country: "Cambodia", code: "+855" },
    { country: "Cameroon", code: "+237" },
    { country: "Canada", code: "+1" },
    { country: "Central African Republic", code: "+236" },
    { country: "Chad", code: "+235" },
    { country: "Chile", code: "+56" },
    { country: "China", code: "+86" },
    { country: "Colombia", code: "+57" },
    { country: "Comoros", code: "+269" },
    { country: "Congo, Republic of the", code: "+242" },
    { country: "Congo, Democratic Republic of the", code: "+243" },
    { country: "Costa Rica", code: "+506" },
    { country: "Croatia", code: "+385" },
    { country: "Cuba", code: "+53" },
    { country: "Cyprus", code: "+357" },
    { country: "Czech Republic", code: "+420" },
    { country: "Denmark", code: "+45" },
    { country: "Djibouti", code: "+253" },
    { country: "Dominica", code: "+1-767" },
    { country: "Dominican Republic", code: "+1-809" },
    { country: "Ecuador", code: "+593" },
    { country: "Egypt", code: "+20" },
    { country: "El Salvador", code: "+503" },
    { country: "Equatorial Guinea", code: "+240" },
    { country: "Eritrea", code: "+291" },
    { country: "Estonia", code: "+372" },
    { country: "Eswatini", code: "+268" },
    { country: "Ethiopia", code: "+251" },
    { country: "Fiji", code: "+679" },
    { country: "Finland", code: "+358" },
    { country: "France", code: "+33" },
    { country: "Gabon", code: "+241" },
    { country: "Gambia", code: "+220" },
    { country: "Georgia", code: "+995" },
    { country: "Germany", code: "+49" },
    { country: "Ghana", code: "+233" },
    { country: "Greece", code: "+30" },
    { country: "Grenada", code: "+1-473" },
    { country: "Guatemala", code: "+502" },
    { country: "Guinea", code: "+224" },
    { country: "Guinea-Bissau", code: "+245" },
    { country: "Guyana", code: "+592" },
    { country: "Haiti", code: "+509" },
    { country: "Honduras", code: "+504" },
    { country: "Hungary", code: "+36" },
    { country: "Iceland", code: "+354" },
    { country: "India", code: "+91" },
    { country: "Indonesia", code: "+62" },
    { country: "Iran", code: "+98" },
    { country: "Iraq", code: "+964" },
    { country: "Ireland", code: "+353" },
    { country: "Israel", code: "+972" },
    { country: "Italy", code: "+39" },
    { country: "Jamaica", code: "+1-876" },
    { country: "Japan", code: "+81" },
    { country: "Jordan", code: "+962" },
    { country: "Kazakhstan", code: "+7" },
    { country: "Kenya", code: "+254" },
    { country: "Kiribati", code: "+686" },
    { country: "Korea, North", code: "+850" },
    { country: "Korea, South", code: "+82" },
    { country: "Kuwait", code: "+965" },
    { country: "Kyrgyzstan", code: "+996" },
    { country: "Laos", code: "+856" },
    { country: "Latvia", code: "+371" },
    { country: "Lebanon", code: "+961" },
    { country: "Lesotho", code: "+266" },
    { country: "Liberia", code: "+231" },
    { country: "Libya", code: "+218" },
    { country: "Liechtenstein", code: "+423" },
    { country: "Lithuania", code: "+370" },
    { country: "Luxembourg", code: "+352" },
    { country: "Madagascar", code: "+261" },
    { country: "Malawi", code: "+265" },
    { country: "Malaysia", code: "+60" },
    { country: "Maldives", code: "+960" },
    { country: "Mali", code: "+223" },
    { country: "Malta", code: "+356" },
    { country: "Marshall Islands", code: "+692" },
    { country: "Mauritania", code: "+222" },
    { country: "Mauritius", code: "+230" },
    { country: "Mexico", code: "+52" },
    { country: "Micronesia", code: "+691" },
    { country: "Moldova", code: "+373" },
    { country: "Monaco", code: "+377" },
    { country: "Mongolia", code: "+976" },
    { country: "Montenegro", code: "+382" },
    { country: "Morocco", code: "+212" },
    { country: "Mozambique", code: "+258" },
    { country: "Myanmar", code: "+95" },
    { country: "Namibia", code: "+264" },
    { country: "Nauru", code: "+674" },
    { country: "Nepal", code: "+977" },
    { country: "Netherlands", code: "+31" },
    { country: "New Zealand", code: "+64" },
    { country: "Nicaragua", code: "+505" },
    { country: "Niger", code: "+227" },
    { country: "Nigeria", code: "+234" },
    { country: "North Macedonia", code: "+389" },
    { country: "Norway", code: "+47" },
    { country: "Oman", code: "+968" },
    { country: "Pakistan", code: "+92" },
    { country: "Palau", code: "+680" },
    { country: "Panama", code: "+507" },
    { country: "Papua New Guinea", code: "+675" },
    { country: "Paraguay", code: "+595" },
    { country: "Peru", code: "+51" },
    { country: "Philippines", code: "+63" },
    { country: "Poland", code: "+48" },
    { country: "Portugal", code: "+351" },
    { country: "Qatar", code: "+974" },
    { country: "Romania", code: "+40" },
    { country: "Russia", code: "+7" },
    { country: "Rwanda", code: "+250" },
    { country: "Saint Kitts and Nevis", code: "+1-869" },
    { country: "Saint Lucia", code: "+1-758" },
    { country: "Saint Vincent and the Grenadines", code: "+1-784" },
    { country: "Samoa", code: "+685" },
    { country: "San Marino", code: "+378" },
    { country: "Sao Tome and Principe", code: "+239" },
    { country: "Saudi Arabia", code: "+966" },
    { country: "Senegal", code: "+221" },
    { country: "Serbia", code: "+381" },
    { country: "Seychelles", code: "+248" },
    { country: "Sierra Leone", code: "+232" },
    { country: "Singapore", code: "+65" },
    { country: "Slovakia", code: "+421" },
    { country: "Slovenia", code: "+386" },
    { country: "Solomon Islands", code: "+677" },
    { country: "Somalia", code: "+252" },
    { country: "South Africa", code: "+27" },
    { country: "South Sudan", code: "+211" },
    { country: "Spain", code: "+34" },
    { country: "Sri Lanka", code: "+94" },
    { country: "Sudan", code: "+249" },
    { country: "Suriname", code: "+597" },
    { country: "Sweden", code: "+46" },
    { country: "Switzerland", code: "+41" },
    { country: "Syria", code: "+963" },
    { country: "Taiwan", code: "+886" },
    { country: "Tajikistan", code: "+992" },
    { country: "Tanzania", code: "+255" },
    { country: "Thailand", code: "+66" },
    { country: "Timor-Leste", code: "+670" },
    { country: "Togo", code: "+228" },
    { country: "Tonga", code: "+676" },
    { country: "Trinidad and Tobago", code: "+1-868" },
    { country: "Tunisia", code: "+216" },
    { country: "Turkey", code: "+90" },
    { country: "Turkmenistan", code: "+993" },
    { country: "Tuvalu", code: "+688" },
    { country: "Uganda", code: "+256" },
    { country: "Ukraine", code: "+380" },
    { country: "United Arab Emirates", code: "+971" },
    { country: "United Kingdom", code: "+44" },
    { country: "United States", code: "+1" },
    { country: "Uruguay", code: "+598" },
    { country: "Uzbekistan", code: "+998" },
    { country: "Vanuatu", code: "+678" },
    { country: "Vatican City", code: "+379" },
    { country: "Venezuela", code: "+58" },
    { country: "Vietnam", code: "+84" },
    { country: "Yemen", code: "+967" },
    { country: "Zambia", code: "+260" },
    { country: "Zimbabwe", code: "+263" }
  ];

}