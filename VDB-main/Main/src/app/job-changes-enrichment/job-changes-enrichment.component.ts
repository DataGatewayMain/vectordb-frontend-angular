import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterService } from '../mainpage/sidenavfolders/search/filters/filter.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-changes-enrichment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-changes-enrichment.component.html',
  styleUrl: './job-changes-enrichment.component.css',
})
export class JobChangesEnrichmentComponent {
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

  constructor(
    private router: Router,
    private filterService: FilterService,
    private authService: AuthService,
    private apiService: GetDataService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchJobChanges();
    this.search();
  }

  constructFilters(): any {
    return {
      include_job_title: '',
      include_country: '',
      include_company_domain: '',
      include_company_name: '',
      include_state: '',
      include_city: '',
      include_region: '',
      include_Industry: '',
      include_Zip_Code: '',
      include_sic: '',
      include_naic: '',
      include_employee_size: '',
      include_job_function: '',
      include_job_level: '',
      exclude_job_title: '',
      exclude_industry: '',
      exclude_company_name: '',
      exclude_country: '',
      exclude_company_domain: '',
    };
  }

  search(): void {
    this.loading = true;
    this.selectedRows = [];
    const filtersToSend = this.constructFilters();
    this.apiService.savedsearch(filtersToSend, this.currentPage).subscribe(
      (data: any) => {
        if (data && data.saved_data) {
          this.results = data.saved_data;
          this.count = data.saved_count || 0;

          // Filter out results where job changes occurred
          this.filteredResults = this.results.filter(
            (result) =>
              this.updatedPids.includes(result.pid) &&
              (result.company_name !== result.v19_company ||
                result.job_title !== result.v19_title)
          );

          if (data.saved_pagination) {
            this.totalPages = data.saved_pagination.total_pages_saved || 0;
          } else {
            this.totalPages = 0;
          }

          this.paginationTotal = this.calculatePaginationDetails(
            this.currentPage,
            this.filteredResults.length
          );
        } else {
          this.results = [];
          this.count = 0;
          this.totalPages = 0;
          this.snackbar.open(
            'No data available for the current search.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      },
      (error: any) => {
        this.loading = false;
        this.snackbar.open(
          'Error fetching data. Please try again later.',
          'Close',
          {
            duration: 3000,
          }
        );
      },
      () => {
        this.loading = false;
      }
    );
  }

  jobChangesData: any[] = [];
  updatedCount: number = 0;

  fetchJobChanges() {
    const filtersToSend = this.constructFilters();
    this.apiService.jobChanges(filtersToSend).subscribe(
      (response: { updated_count: number; updated_data: any[] }) => {
        if (response) {
          // Filter updated_data for entries where both job title and company name have changed
          const filteredData = response.updated_data.filter(
            (item) =>
              item.v19_title !== item.job_title ||
              item.v19_company !== item.company_name
          );

          this.updatedCount = filteredData.length;
          this.jobChangesData = filteredData;
          this.updatedPids = this.jobChangesData.map((item) => item.pid);
        }
      },
      (error: any) => {}
    );
  }

  comparePIDs(item: any, job: any): boolean {
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
  }

  getDisplayedCompanyDomain(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getCompanyDomain(item, job)) {
        foundMatch = true;
        return this.getCompanyDomain(item, job);
      }
    }
    return item.company_domain;
  }

  getDisplayedJobTitle(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.comparePIDs(item, job)) {
        foundMatch = true;
        return this.getJobTitle(item, job);
      }
    }
    return item.job_title;
  }

  getDisplayedCompanyName(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getCompanyName(item, job)) {
        foundMatch = true;
        return this.getCompanyName(item, job);
      }
    }
    return item.company_name;
  }

  getDisplayedEmailAddress(item: any): string {
    let foundMatch = false;
    for (const job of this.jobChangesData) {
      if (this.getEmailAddress(item, job)) {
        foundMatch = true;
        return this.getEmailAddress(item, job);
      }
    }
    return item.email_address;
  }

  calculatePaginationDetails(currentPage: number, count: number): any {
    const recordsPerPage = 50;
    const totalPages = Math.ceil(count / recordsPerPage);
    return { totalPages, recordsPerPage };
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.search();
    } else {
      console.warn('Page out of range:', page);
    }
  }

  defaultImage = './assets/company.svg';

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }

  toggleSelection(item: any): void {
    item.isSelected = !item.isSelected;

    if (item.isSelected) {
      this.selectedRows.push(item);
    } else {
      this.selectedRows = this.selectedRows.filter((row) => row.id !== item.id);
    }
  }

  selectedItemId: number | undefined;

  isRowSelected(row: any): boolean {
    return this.selectedRows.some((selectedRow) => selectedRow.id === row.id);
  }
  toggleValidation(item: any): void {
    item.loading = true;

    setTimeout(() => {
      item.showValidation = true;
      item.loading = false;

      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        const api_key = this.authService.getapi_key();

        const newSelectedRows = [{ id: this.selectedItemId }];

        this.apiService.updateData(newSelectedRows).subscribe(
          (response) => {
            this.snackbar.open('record updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['custom-snackbar', 'snackbar-success'],
            });
            this.saveData();
          },
          (error) => {}
        );
      } else {
      }
    }, 2000);
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

  updateSelectedRows(): void {
    if (this.selectedRows.length > 0) {
      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        const ids = this.selectedRows.map((row) => row.id);

        this.apiService.updateData(this.selectedRows).subscribe(
          (response: any) => {
            this.saveData();
            this.selectedRows = [];
            this.snackbar.open(
              'Contact has been updated successfully!',
              'Close',
              {
                duration: 3000,
              }
            );
          },
          (error: any) => {
            console.error('Error saving data:', error);
          }
        );
      } else {
        console.error('User email not found.');
      }
    } else {
      console.warn('No rows selected.');
    }
  }
  saveData(): void {}

  fixRow(row: any): void {
    const isSelected = this.isRowSelected(row);
    if (!isSelected) {
      this.toggleRowSelection(row);
    }

    const userEmail = localStorage.getItem('email');

    if (userEmail) {
      const api_key = this.authService.getapi_key();
      this.apiService.updateData([row]).subscribe(
        (response) => {
          this.saveData();
          this.snackbar.open('Row has been updated successfully!', 'Close', {
            duration: 3000,
          });
          this.toggleRowSelection(row);
        },
        (error) => {
          console.error('Error fixing data:', error);
        }
      );
    } else {
      console.error('User email not found.');
    }
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedRows = [...this.filteredResults];
    } else {
      this.selectedRows = [];
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
}
