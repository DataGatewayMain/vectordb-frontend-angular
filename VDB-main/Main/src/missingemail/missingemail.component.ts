import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FilterService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-missingemail',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './missingemail.component.html',
  styleUrl: './missingemail.component.css'
})
export class MissingemailComponent {
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
  selectAllChecked: boolean = false;
  jobChangesData: any[] = [];
  updatedCount: number = 0;
  defaultImage = './assets/company.svg';

  constructor(
    private router: Router,
    private filterService: FilterService,
    private authService: AuthService,
    private apiService: GetDataService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.fetchJobChanges(); 
    this.search(); 
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

  fetchResultsData(): void {
    this.selectedRows = [];
    const filtersToSend = this.constructFilters();
    this.apiService.savedsearch(filtersToSend, this.currentPage).subscribe(
      (data) => {
        this.results = data;  // Assuming data is an array
        console.log('Fetched results:', this.results);
      },
      (error) => {
        console.error('Error fetching results:', error);
      }
    );
  }
  search(): void {
    this.loading = true;
    this.selectedRows = [];
    const filtersToSend = this.constructFilters();
    this.apiService.savedsearch(filtersToSend, this.currentPage).subscribe(
      (data: any) => {
        console.log('Data fetched:', data);  // Log the API response
        if (data && data.saved_data) {
          this.results = data.saved_data; 
          this.count = data.saved_count || 0;
          console.log('First result item:', this.results[0]); // Log the first result item to check its structure

          // Check what's in the results
          console.log('Results:', this.results); // Log the results
          
          // Apply filtering logic
          this.filteredResults = this.results.filter(result => 
            this.updatedPids.includes(result.pid)
          );
          
          console.log('Filtered Results:', this.filteredResults); // Log filtered results
  
          if (data.saved_pagination) {
            this.totalPages = data.saved_pagination.total_pages_saved || 0;
          } else {
            console.error('Pagination data missing from backend response.');
            this.totalPages = 0;
          }
  
          this.paginationTotal = this.calculatePaginationDetails(
            this.currentPage,
            this.filteredResults.length
          );
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
  

  fetchJobChanges() {
    const filtersToSend = this.constructFilters();
    this.apiService.jobChanges(filtersToSend).subscribe(
      (response: { updated_count: number; updated_data: any[] }) => {
        console.log('Job changes response:', response); // Log response to validate structure
        if (response) {
          this.updatedCount = response.updated_count;
          this.jobChangesData = response.updated_data.filter(item => item.v19_email !== item.email_address);
          this.updatedPids = this.jobChangesData.map(item => item.pid);
        }
      },
      (error: any) => {
        console.error('Error fetching job changes:', error);
      }
    );
  }
  
  
  fetchIdsForJobChanges() {

    const selectedRowIds = this.selectedRows
    .filter(row => row.id)  // Only include rows that have an id
    .map(row => row.id);
    this.apiService.saveDataToUserAccount1(selectedRowIds).subscribe(
      (response: any[]) => {
        // Ensure the mapping is working
      const idMap = response.reduce((map, obj) => {
        console.log(`Mapping pid: ${obj.pid} to id: ${obj.id}`); // Log each mapping
        map[obj.pid] = obj.id;
        return map;
      }, {});

      console.log('ID Map:', idMap); // Log the entire ID map

      // Enrich jobChangesData with 'id' field
      this.jobChangesData.forEach(item => {
        if (idMap[item.pid]) {
          item.id = idMap[item.pid]; // Assign the id from the map
          console.log(`Assigned id: ${item.id} to pid: ${item.pid}`); // Log the successful assignment
        } else {
          console.warn(`No 'id' found for pid: ${item.pid}`); // Log missing ids
        }
      });

      console.log('Enriched jobChangesData:', this.jobChangesData); // Verify enriched data
    },
    (error) => {
      console.error('Error fetching ids:', error);
    }
  );}
  
  
  
  calculatePaginationDetails(currentPage: number, count: number): any {
    const recordsPerPage = 50;
    const totalPages = Math.ceil(count / recordsPerPage);
    return { totalPages, recordsPerPage };
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.search();
    }
  }

  toggleRowSelection(item: any): void {
    const index = this.selectedRows.findIndex(row => row.pid === item.pid);
    if (index === -1) {
      // Add the item if not selected
      this.selectedRows.push(item);
    } else {
      // Remove the item if already selected
      this.selectedRows.splice(index, 1);
    }
  }
  
  selectAllRows(): void {
    this.selectAllChecked = !this.selectAllChecked;
    
    if (this.selectAllChecked) {
      // Select all rows with id from jobChangesData
      this.selectedRows = this.jobChangesData.filter(row => row.id);  // Only include rows with `id`
    } else {
      // Deselect all rows
      this.selectedRows = [];
    }
    
    console.log('Selected Rows after select all:', this.selectedRows);
  }
  

  isRowSelected(row: any): boolean {
    return this.selectedRows.some(selectedRow => selectedRow.pid === row.pid);
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.selectedRows = isChecked ? [...this.filteredResults] : [];
  }

  updateSelectedRows(): void {
    // Check if selectedRows is an array
    if (Array.isArray(this.selectedRows)) {
      const selectedRowIds = this.selectedRows
        .filter(row => row.id)  // Only include rows that have an id
        .map(row => row.id);
  
      console.log('Selected Row IDs (after select all):', selectedRowIds);
  
      if (selectedRowIds.length > 0) {
        this.apiService.saveDataToUserAccount1(selectedRowIds).subscribe(
          (response) => {
            console.log('Data updated successfully!', response);
          },
          (error) => {
            console.error('Error fixing data:', error);
          }
        );
      } else {
        console.warn('No valid IDs selected for update.');
        this.snackbar.open('No valid IDs selected for update.', 'Close', { duration: 3000 });
      }
    } else {
      console.error('selectedRows is not an array:', this.selectedRows);
      this.snackbar.open('Invalid data structure for selected rows.', 'Close', { duration: 3000 });
    }
  }
  fixRow(row: any): void {
    
    if (!Array.isArray(this.selectedRows)) {
      console.error('selectedRows is not an array:', this.selectedRows);
      this.snackbar.open('Error: selectedRows is not an array.', 'Close', { duration: 3000 });
      return;
    }
  
    console.log(`FixRow: Looking for pid: ${row.pid}`);
  
    if (!this.results || this.results.length === 0) {
      console.error('No data found in results.');
      this.snackbar.open('No data found in saved data.', 'Close', { duration: 3000 });
      return;
    }
  
    // Filter results to find matching row by pid
    const savedDataMatches = this.results.filter(savedRow => savedRow.pid && String(savedRow.pid).trim() === String(row.pid).trim());
    console.log('Matching Rows:', savedDataMatches);
  
    if (savedDataMatches.length === 0) {
      console.error(`No matching entry found in saved data for pid: ${row.pid}`);
      this.snackbar.open(`No saved data found for pid ${row.pid}.`, 'Close', { duration: 3000 });
      return;
    }
  
    // Get the matching job change data (if any)
    const jobChangeMatch = this.jobChangesData.find(jobChange => jobChange.pid === row.pid);
    if (!jobChangeMatch) {
      console.error(`No job change data found for pid: ${row.pid}`);
      this.snackbar.open(`No job change data found for pid ${row.pid}.`, 'Close', { duration: 3000 });
      return;
    }
  
    // Combine the saved data with the job change match
    const updatedRowData = { ...savedDataMatches[0], ...jobChangeMatch };
    console.log('Updated Row Data:', updatedRowData);
  
    // Update the matching row in selectedRows
    if (Array.isArray(this.selectedRows)) {
      const matchingIndex = this.selectedRows.findIndex(row => row.pid === updatedRowData.pid);
  
      if (matchingIndex > -1) {
        this.selectedRows[matchingIndex] = { ...this.selectedRows[matchingIndex], ...updatedRowData };
        console.log('Updated matching row:', this.selectedRows[matchingIndex]);
      } else {
        console.error('Matching row not found in selectedRows.');
        this.snackbar.open('No matching row found to update.', 'Close', { duration: 3000 });
      }
    } else {
      console.error('selectedRows is not an array:', this.selectedRows);
      this.snackbar.open('Selected rows are not in the correct format.', 'Close', { duration: 3000 });
    }
  
    // Perform the backend update (optional)
    this.apiService.saveDataToUserAccount1(updatedRowData.id).subscribe(
      (response) => {
        console.log('Backend update success:', response);
        this.snackbar.open('Record updated successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error saving data:', error);
        this.snackbar.open('Error saving data. Please try again later.', 'Close', { duration: 3000 });
      }
    );
  }
  


  

  
}