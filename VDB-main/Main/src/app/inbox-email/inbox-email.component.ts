import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig'; // Import EditorConfig interface
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

interface Sender {
  first_name: string;
  last_name: string;
  username: string;
  host?: string;
  password?: string;
}

@Component({
  selector: 'app-inbox-email',
  templateUrl: './inbox-email.component.html',
  styleUrls: ['./inbox-email.component.css']
})
export class InboxEmailComponent implements OnInit {
  userEmail: any;
  userFirstName: any;
  userLastName: any;
  userapi_key: any;
  height: any;
  emailSenders: Sender[] = [];
  hasEmailSenders = false;
  updateDialogOpen = false;
  isLoading = true;
  selectedSender: Sender | any = null;
  emailContent: string = '';
  emailSubject: string = '';

  public Editor = ClassicEditor;
  public editorData = '';
  public editorConfig: EditorConfig = {

  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string, first_name: string, last_name: string },
    private dialogRef: MatDialogRef<InboxEmailComponent>,
    private emailService: GetDataService,
    private snackbar:MatSnackBar,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchEmailSenders();
    this.userapi_key = localStorage.getItem('api_key');
  }

  fetchEmailSenders() {
    this.emailService.fetchEmailDetails(this.userapi_key).subscribe(response => {
      this.emailSenders = (response.data || []).filter((sender: any) => sender.host && sender.password);
      this.hasEmailSenders = this.emailSenders.length > 0;
      this.isLoading = false;
      if (this.emailSenders.length > 0) {
        this.selectedSender = this.emailSenders[0];
      }
      console.log('email data from inbox component', this.emailSenders);
    }, error => {
      console.error('Error fetching email senders', error);
      this.isLoading = false;
    });
  }

  getDisplayValue(sender: Sender): string {
    return sender ? `${sender.first_name} ${sender.last_name} <${sender.username}>` : '';
  }

  private bouncifyApiUrl = 'https://api.bouncify.io/v1/verify';
  verifyEmail(email: string) {
    const apiKey = 'zm188nmugx9ptyyojki37qvjnvayo6xj';  // Replace with your actual API key
    const url = `${this.bouncifyApiUrl}?apikey=${apiKey}&email=${email}`;
  
    // Return an observable that can be subscribed to in the addRecipient method
    return this.http.get(url);
  }

  sendEmail() {
    if (!this.selectedSender) {
      console.error('No sender selected');
      return;
    }
  
    const sentAt = new Date().toISOString(); // Get local time in ISO format
    const toName = `${this.data.first_name} ${this.data.last_name}`; // Extract to_name from data
  
    // Verify the recipient's email first
    this.verifyEmail(this.data.email).subscribe(
      (response: any) => {
        if (response.result === 'deliverable') {
          // If the email is deliverable, proceed with sending the email
          const emailData = {
            from: this.selectedSender.username,
            to: this.data.email,
            subject: this.emailSubject,
            message: this.editorData,
            fromName: `${this.selectedSender.first_name} ${this.selectedSender.last_name}`,
            to_name: toName, // Add the to_name field
            smtp: {
              host: this.selectedSender.host,
              username: this.selectedSender.username,
              password: this.selectedSender.password
            },
            api: this.userapi_key,
            sent_at: sentAt // Add the sent_at field
          };
  
          console.log('Sending email with data:', JSON.stringify(emailData, null, 2));
  
          this.emailService.sendEmail(emailData).subscribe(response => {
            console.log('Email sent successfully', response);
            this.dialogRef.close();
            this.snackbar.open("Email sent successfully",'close',{
              duration:2000
            })
          }, error => {
            console.error('Error sending email', error);
          });
        } else {
          // If the email is not deliverable, show an error message
          this.snackbar.open('Invalid or undeliverable email address.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['custom-snackbar', 'snackbar-warning'],
          });
        }
      },
      (error: any) => {
        console.error('Error verifying email:', error);
        this.snackbar.open('Error verifying email. Please try again later.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  }
  
  
  
  
  

  closeDialog(): void {
    this.dialogRef.close();
  }
}
