import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JoyrideModule } from 'ngx-joyride';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EmailLinkDialogComponent } from 'src/app/email-link-dialog/email-link-dialog.component';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
@Component({
  selector: 'app-emaildialogue',
  templateUrl: './emaildialogue.component.html',
  styleUrls: ['./emaildialogue.component.css']
})
export class EmaildialogueComponent {
  page: number = 1; 
  userEmail: any;
  userFirstName: any;
  userLastName: any;
  userapi_key: any;
  activateLinkColor = '#ff0000';  
  emailSenders: any[] = [];
  hasEmailSenders = false;
  updateDialogOpen = false;
  isLoading = true; 
  isAddDialogOpen = false; 
  activeSection: string = ''; 
  emailData = {
    from: '',
    fromName: '',
    to: '',
    subject: '',
    message: '',
    smtp: {
      host: '',
      username: '',
      password: '',
      first_name:'',
      last_name:''
    }
  };
  inboxDetails: any[] = [];

  constructor(private emailService: GetDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName');
    this.userEmail = localStorage.getItem('email');
    this.userLastName = localStorage.getItem('lastName');
    this.userapi_key = localStorage.getItem('api_key');

    this.fetchEmailSenders();
    this.fetchInbox();
  }

  getInitial(fullName: string): string {
    if (!fullName) return '';
    return fullName.charAt(0).toUpperCase(); // Return the first initial
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  openUpdateDialog(sender: any) {
    this.emailData.smtp.username = sender.username;
    this.updateDialogOpen = true;
  }

  linkEmail() {
    const data = {
      username: this.userEmail,
      host: null,
      password: null,
      api: this.userapi_key,
      first_name: this.userFirstName,
      last_name: this.userLastName
    };

    this.emailService.sendEmailDetails(data).subscribe((response: { data: any; }) => {
      this.activateLinkColor = '#FF0000';
      this.openUpdateDialog(response.data);
    }, (error: any) => {
      console.error('Error sending data', error);
    });
  }

  fetchEmailSenders() {
    this.emailService.fetchEmailDetails(this.userapi_key).subscribe((response: { data: never[]; }) => {
      this.emailSenders = response.data || [];
      this.hasEmailSenders = this.emailSenders.length > 0;
      this.isLoading = false;
    }, (error: any) => {
      console.error('Error fetching email senders', error);
      this.isLoading = false; 
    });
  }

  fetchInbox() {
    this.emailService.fetchInboxDetails(this.userapi_key).subscribe((response: { data: any[]; }) => {
      this.inboxDetails = response.data || [];
    }, (error: any) => {
      console.error('Error fetching inbox details', error);
    });
  }

  // this.userapi_key

  onSubmit() {
    this.emailService.sendEmail(this.emailData).subscribe((response: any) => {
    }, (error: any) => {
      console.error('Error sending email', error);
    });
  }

  onUpdateSubmit() {
    const updateData = {
      username: this.emailData.smtp.username,
      host: this.emailData.smtp.host,
      password: this.emailData.smtp.password,
      api: this.userapi_key,
      first_name: this.userFirstName,
      last_name: this.userLastName
    };

    this.emailService.updateEmailDetails(updateData).subscribe((response: any) => {
      this.updateDialogOpen = false;
      this.fetchEmailSenders();
    }, (error: any) => {
      console.error('Error updating email', error);
    });
  }

  activateEmail(sender: any) {
    this.openUpdateDialog(sender);
  }

  isEmailDetailsComplete(sender: any): boolean {
    return sender.host && sender.password;
  }

  openAddSenderDialog() {
    this.emailData = {
      from: '',
      fromName: '',
      to: '',
      subject: '',
      message: '',
      smtp: {
        host: '',
        username: '',
        password: '',
        first_name:'',
        last_name:''
      }
    };
    this.isAddDialogOpen = true;
  }
  
  onAddSubmit() {
    const addData = {
      username: this.emailData.smtp.username,
      host: this.emailData.smtp.host,
      password: this.emailData.smtp.password,
      api: this.userapi_key,
      first_name: this.emailData.smtp.first_name,
      last_name: this.emailData.smtp.last_name
    };
  
    this.emailService.sendEmailDetails(addData).subscribe((response: any) => {
      this.isAddDialogOpen = false;
      this.fetchEmailSenders();
    }, (error: any) => {
      console.error('Error adding email sender', error);
    });
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
  
  selectedEmail: any = null;

  viewEmailDetails(email: any) {
    this.selectedEmail = email;
    console.log('Selected email details:', email); 
  }
  openDialog(): void {
    this.dialog.open(EmailLinkDialogComponent, {
      width: '1000px',
      height: '700px',
    });
  }

  backToInbox() {
    this.selectedEmail = null;  // Reset the selected email
  }

}

