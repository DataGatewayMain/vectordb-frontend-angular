import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { EmailLinkDialogComponent } from '../email-link-dialog/email-link-dialog.component';
import { EmaildialogueComponent } from '../emaildialogue/emaildialogue.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {
  dataAvailable: boolean = false; // Flag to check if data is available

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private getDataService: GetDataService,
    private authService: AuthService // Inject AuthService to get the API key
  ) {}

  ngOnInit(): void {
    this.checkEmailDetails();
  }

  private checkEmailDetails(): void {
    const apiKey = this.authService.getapi_key(); // Retrieve API key from AuthService or local storage
    if (apiKey) {
      this.getDataService.fetchEmailDetails(apiKey).subscribe(
        response => {
          // Log the entire response to check its structure
          console.log('Fetched response:', response);

          // Check if response has a data property which is an array and contains at least one item
          this.dataAvailable = response.data && Array.isArray(response.data) && response.data.length > 0;
          
          if (this.dataAvailable) {
            this.redirectToEmailDialoguComponent();
          } else {
            this.showContent();
          }
        },
        error => {
          console.error('Error fetching email details', error);
          // Handle error case
        }
      );
    } else {
      console.error('API key not found');
      // Handle case when API key is not available
    }
  }
  
  private redirectToEmailDialoguComponent(): void {
    this.router.navigate(['/home/emaildialogue']); // Adjust the route as needed
  }

  public showContent(): void {
    this.dialog.open(EmailLinkDialogComponent, {
      width: '1000px',
      height: '700px',
    });
  }
}
