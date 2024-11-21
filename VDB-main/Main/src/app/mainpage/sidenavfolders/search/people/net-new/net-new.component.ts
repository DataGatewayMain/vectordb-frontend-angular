import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDetailsComponent } from '../total/user-details/user-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilterService } from '../../filters/filter.service';
import { GetDataService } from '../get-data.service';
import saveAs from 'file-saver';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { JoyrideService } from 'ngx-joyride';
import { GuideComponent } from 'src/app/guide/guide.component';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsForNetnewComponent } from 'src/app/user-details-for-netnew/user-details-for-netnew.component';
import { DialogueSaveComponent } from 'src/app/dialogue-save/dialogue-save.component';
import { InboxEmailComponent } from 'src/app/inbox-email/inbox-email.component';

@Component({
  selector: 'app-net-new',
  templateUrl: './net-new.component.html',
  styleUrls: ['./net-new.component.css']
})
export class NetNewComponent implements OnInit, OnDestroy {
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
  originalResults: any[] = [];
  private filterSubscription: Subscription;
  updatedPids: any;

  constructor(
    private apiService: GetDataService,
    private readonly joyrideService: JoyrideService,
    private filterService: FilterService,
    private dialog: MatDialog,
    private router: Router,
    private loadingBar: LoadingBarService,
    private authService: AuthService,

  ) 
  
  {
    this.filterSubscription = this.filterService.filters$
    .pipe(
      debounceTime(300), // wait for 300ms pause in events
      distinctUntilChanged() // only emit if value is different from the last one
    )
    .subscribe((filters) => {
      this.filters = filters;
      this.startProgressBar();
      this.search();
    });
  
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.saveDataToUserAccount();
    this.search();
    console.log("this is the result",this.results);
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
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  openUserDetails(prospectLink: string): void {
    this.router.navigate(['userDetails', prospectLink]);
  }

  search(): void {
    this.loading = true;
    this.startProgressBar();

    this.apiService.net_new_search(this.filters, this.currentPage).subscribe(
      (data: any) => {
        this.results = data.net_new_data;
        this.loading = false;
        this.isLoading = false;
        this.totalPages = parseInt(data.net_new_pagination.total_pages_net_new, 10);
        this.paginationTotal = this.calculatePaginationDetails(
          this.currentPage,
          data.net_new_count
        );
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  calculatePaginationDetails(currentPage: number, totalItems: number): any {
    const totalPages = Math.ceil(totalItems / this.recordsPerPage);

    return {
      current_page_net_new: currentPage,
      net_new_pagination: totalPages,
      records_per_page: this.recordsPerPage,
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
    const index = this.selectedRows.findIndex((selectedRow) => selectedRow.id === row.id);
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.some((selectedRow) => selectedRow.id === row.id);
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
        },
        (error) => {
          console.error('Error exporting data:', error);
        }
      );
    } else {
      console.error('User API key not found.');
    }
  }
  
  dataSaved: boolean = false;

  // saveDataToUserAccount(): void {
  //   const userEmail = localStorage.getItem('email');
  //   if (userEmail) {
  //     this.apiService.saveDataToUserAccount(userEmail, this.selectedRows).subscribe(
  //       (response) => {
  //         this.selectedRows = [];
  //       },
  //       (error) => {
  //         if (error.status === 501) {
  //           console.error('Connection failed', error);
  //         } else if (error.status === 409 || error.status === 500) {
  //           console.error('Already saved record', error);
  //         }
  //       }
  //     );
  //   } else {
  //     console.error('User email not found.');
  //   }
  // }
  


  

  enableExportButton(): void {
    this.dataSaved = true;
  }

  prospectlink: any;

  toggleValidation(item: any): void {
    item.loading = true;
  
    setTimeout(() => {
      item.showValidation = true;
      item.loading = false;
  
      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        const api_key = this.authService.getapi_key();
        const selectedRowId = item.id;
        this.prospectlink = item.id;
  
        this.selectedRows = [item];
  
        console.log('Calling saveDataToUserAccount1 with:', this.selectedRows);
  
        this.apiService.saveDataToUserAccount1(this.selectedRows).subscribe(
          (response) => {
            console.log('saveDataToUserAccount1 success response:', response);
            this.saveData();
          },
          (error) => {
            console.error('Error saving data:', error);
          }
        );
      } else {
        console.error('User email not found.');
      }
    }, 2000);
  }
  
  
  
  

  saveData(): void {
    this.apiService.saveDataToUserAccount1(this.selectedRows).subscribe(
      (response) => {
        this.selectedRows = [];
      },
      (error) => {
        console.error('Error:', error);
        console.log('Saving data...');
        if (error.status === 409) {
        } else if (error.status === 500) {
        }
      }
    );
  }

  startProgressBar(): void {
    this.loadingBar.start();
    const interval = setInterval(() => {
      this.progressValue += 10;
      if (this.progressValue >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }

  openUserDialog(editData: any) {
    let dialogRef = this.dialog.open(UserDetailsForNetnewComponent, {
      data: { editData },
      height: '100%',
      width: '450px',
      position: { right: '0px', top: '320px', bottom: '100px' },
    });
  }

  openExportDialogue(): void {
    this.dialog.open(DialogueSaveComponent, {
      data: { selectedRows: this.selectedRows },
      position: { top: '0%', left: '50%' },
      panelClass: 'custom-dialog-container'
    });
  }
  
// 29-10-24
buyingIntentData: any;
fetchBuyingIntentData(page: number, filters: any): void {
  this.apiService.getBuyingIntentData(page, filters).subscribe(
    (response) => {
      this.buyingIntentData = response;
      console.log('Data received Saved Component:', this.buyingIntentData);
    },
    (error) => {
      console.error('Error fetching data', error);
    }
  );
}



jobChangesData: any[] = [];
updatedCount: number = 0;

fetchJobChanges() {
  this.apiService.jobChanges(this.filters).subscribe(
    response => {
      if (response) {
        this.updatedCount = response.updated_count;
        this.jobChangesData = response.updated_data;

        // Store the pids of updated records
        this.updatedPids = this.jobChangesData.map(item => item.pid); // Assuming 'pid' is a property of the item
      }
    },
    error => {
      console.error('Error fetching job changes:', error);
    }
  );
}
defaultImage = './assets/company.svg'; // Default image path

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }

comparePIDs(item: any, job: any): boolean {
  // console.log(`Comparing PIDs: item.pid = ${item.pid}, job.pid = ${job.pid}`); // Log the PIDs being compared
  return item.pid === job.pid;
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

getCompanyName(item: any, job: any): string {
  if (this.comparePIDs(item, job)) {
    if (item.company_name !== job.company_name) {
      return job.company_name; 
    }
  }
  return item.company_name;
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








  selectAllChecked: boolean = false;

  selectAllRows(): void {
    this.selectAllChecked = !this.selectAllChecked;

    if (this.selectAllChecked) {
      this.selectedRows = [...this.results];
    } else {
      this.selectedRows = [];
    }
  }

  openGuide(): void {
    this.dialog.open(GuideComponent, {
      width: '700px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'guide-dialog',
    });
  }
  isDropdownOpen = false;
  sortCriteria = 'Relevance';
  sortOrder = 'Ascending';


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSortCriteriaChange(event: Event) {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
  }

  onSortOrderChange(event: Event) {
    this.sortOrder = (event.target as HTMLSelectElement).value;
  }

  applySort() {
    this.sortData();
    this.toggleDropdown();
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
    this.results = [...this.originalResults];
  }

  sortByName() {
    this.results.sort((a: any, b: any) => {
      const nameA = a.first_name || '';
      const nameB = b.first_name || '';
      return this.sortOrder === 'Ascending' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  sortByCompany() {
    this.results.sort((a: any, b: any) => {
      const companyA = a.company_name || '';
      const companyB = b.company_name || '';
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

  sortByIndustry() {
    this.results.sort((a: any, b: any) => {
      const industryA = a.industry || '';
      const industryB = b.industry || '';
      return this.sortOrder === 'Ascending' ? industryA.localeCompare(industryB) : industryB.localeCompare(industryA);
    });
  }

  sortByEmployees() {
    this.results.sort((a: any, b: any) => {
      const employeesA = a.employee_size || '';
      const employeesB = b.employee_size || '';
      return this.sortOrder === 'Ascending' ? employeesA.localeCompare(employeesB) : employeesB.localeCompare(employeesA);
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

 

  isDialogOpen: boolean = false;
  isDialogOpenPhone: boolean = false;
  selectedEmail: string | null = null;
  isCopiedMessageVisible = false;
  selectedPhone: string | null = null;
  selectedRowId: number | null = null;

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
  itemsPerPage: number = 50;
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
 
  sendEmail(email: string, firstName: string, lastName: string): void {
    const dialogRef = this.dialog.open(InboxEmailComponent, {
      width: '500px',
      height: '700px ',
      data: { email: email, first_name: firstName, last_name: lastName },
      position: { right: '100px' ,bottom:'0px'}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed
    });
  }

  isSelected(): boolean {
    return this.selectedRows.length > 0;
  }
 
}