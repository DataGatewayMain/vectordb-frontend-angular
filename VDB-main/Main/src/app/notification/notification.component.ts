import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilterService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
interface FilterResponse {
  filter_name_count: number; // Assuming this is a number based on your API response
  results: any[]; // Use a more specific type if possible
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  showFilterNotification: boolean = true; 
  showLocationNotification: boolean = true;

  dataofsaved: any[] = []; // Holds the current saved filters
  previousFilterCount: number = 0; // To track previous count
  location: any;
  filters: any = {};
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private filterService: FilterService,
    public dialog: MatDialog,
    private router: Router,
    private service: GetDataService
  ) { }

  ngOnInit(): void {
    this.checkNotificationVisibility();
    this.getSavedFilters();
    
    this.service.notification$.subscribe(() => {
      this.showFilterNotification = true; // Show the notification
    });
  }

  // Check notification visibility based on user-specific local storage data
  checkNotificationVisibility() {
    const api_key = this.authService.getapi_key();

    // Check if the filter notification has been closed for this user
    const filterNotificationClosed = localStorage.getItem(`${api_key}_filterNotificationClosed`);
    const locationNotificationClosed = localStorage.getItem(`${api_key}_locationNotificationClosed`);

    // Set the visibility based on the stored values
    if (filterNotificationClosed) {
      this.showFilterNotification = false;
    }
    if (locationNotificationClosed) {
      this.showLocationNotification = false;
    }

    // Retrieve the previous filter count for this user from localStorage
    const previousCount = localStorage.getItem(`${api_key}_previousFilterCount`);
    if (previousCount) {
      this.previousFilterCount = parseInt(previousCount, 10);
      console.log("Previous filter count:", this.previousFilterCount);
    }
  }

  // Fetch saved filters and check if a new filter has been added
  getSavedFilters() {
    const api_key = this.authService.getapi_key();
    const Url = `https://api.vectordb.app/v1/search/people/getSaveFilter/?api=${api_key}`;

    this.http.get<FilterResponse>(Url).subscribe(
        (res) => {
            const newFilterCount = res.filter_name_count; // Get the count directly
            this.dataofsaved = res.results || []; // Assuming results contain the saved filters

            console.log("New filter count:", newFilterCount); // Log the new filter count

            // Show notification if new filters are detected
            if (newFilterCount > this.previousFilterCount) {
                this.showFilterNotification = true;
                localStorage.removeItem(`${api_key}_filterNotificationClosed`); // Reset notification state
            }

            // Update local storage with the new count
            localStorage.setItem(`${api_key}_previousFilterCount`, newFilterCount.toString());
            this.previousFilterCount = newFilterCount; // Update the previous count
            this.location = localStorage.getItem('location');
        },
        (error) => {
            console.error('Error fetching data:', error);
            // Optionally show an error notification to the user
        }
    );
}


  // Close the notification and update localStorage to prevent it from showing again
  closeNotification(type: string) {
    const api_key = this.authService.getapi_key();

    if (type === 'filter') {
      this.showFilterNotification = false; // Hide the filter notification
      localStorage.setItem(`${api_key}_filterNotificationClosed`, 'true'); // Mark it as closed
    } else if (type === 'location') {
      this.showLocationNotification = false; // Hide the location notification
      localStorage.setItem(`${api_key}_locationNotificationClosed`, 'true'); // Mark it as closed
    }
  }

  closeUserDialog() {
    this.dialog.closeAll();
  }

  totalExportedCount1:any
  exportData(dataToExport: any[]): void {
    const filters = this.filters;
    this.service.exportToCSV(filters, dataToExport).subscribe(
      (data) => {
        const exportedRowCount = dataToExport.length; // Get the count of rows

        // Store the current exportedRowCount in localStorage
        localStorage.setItem('lastExportedRowCount', exportedRowCount.toString());

        // Get the previously exported row count from localStorage
        let totalExportedCount = parseInt(localStorage.getItem('totalExportedCount') || '0', 10);

        // Add current exported row count to the total
        totalExportedCount += exportedRowCount;
       this.totalExportedCount1 += exportedRowCount;
        // Save the updated total back to localStorage
        localStorage.setItem('totalExportedCount', totalExportedCount.toString());


      }
    );
  }










}
