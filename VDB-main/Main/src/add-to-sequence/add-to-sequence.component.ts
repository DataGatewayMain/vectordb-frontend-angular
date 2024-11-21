import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import { EmailselectionComponent } from 'src/emailselection/emailselection.component';

import { EditorConfig } from '@ckeditor/ckeditor5-core';
interface Sender {
  first_name: string;
  last_name: string;
  username: string;
  host?: string;
  password?: string;
}
interface SequenceStep {
  type: string; // 'AI-Generated Email' or 'Preformatted Email'
  name: string;
  subject: string;
  content: string;
}
@Component({
  selector: 'app-add-to-sequence',
  templateUrl: './add-to-sequence.component.html',
  styleUrl: './add-to-sequence.component.css'
})
export class AddToSequenceComponent {
  userEmail: any;
  userFirstName: any;
  userLastName: any;
  userapi_key: any;
  height: any;
  emailSenders: Sender[] = [];
  hasEmailSenders = false;
  isLoading = true;
  selectedSender: Sender | null = null;
  sequence:any
  emailContent: string = '';
  emailSubject: string = '';

  public Editor = ClassicEditor;
  public editorData = '';
  public editorConfig: EditorConfig = {};
  sequenceSteps: SequenceStep[] = [];
  newRecipient: any = '';
  emailData = {
    from: '',
    fromName: '',
    subject: '',
    message: '',
    smtp: {
      host: '',
      username: '',
      password: ''
    },
    recipients: [] as string[] // Initialize as empty
  };
  preformattedEmails: any;

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { recipients: string[] }, // Updated to include recipients
    private dialogRef: MatDialogRef<AddToSequenceComponent>,
    private emailService: GetDataService, private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  closeUserDialog() {
    this.dialog.closeAll()
 }
  ngOnInit(): void {
    this.loadPreformattedEmails();
    this.fetchEmailSenders();
    this.userapi_key = localStorage.getItem('api_key');
    console.log(this.data.recipients, 'this is the recipients');
    if (this.data.recipients) {
      this.emailData.recipients = this.data.recipients;
    }
    console.log('Recipients received:', this.data.recipients);
    this.emailData.recipients = this.data.recipients || [];
  }

  fetchEmailSenders() {
    this.emailService.fetchEmailDetails(this.userapi_key).subscribe(
      (response: { data: any; }) => {
        this.emailSenders = (response.data || []).filter((sender: any) => sender.host && sender.password);
        this.hasEmailSenders = this.emailSenders.length > 0;
        this.isLoading = false;

        if (this.hasEmailSenders) {
          this.selectedSender = this.emailSenders[0];
        } else {
          this.snackbar.open('No email sender linked. Please link an email sender first.', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['custom-snackbar', 'snackbar-warning'],
          });
        }

        console.log('email data from inbox component', this.emailSenders);
      },
      (error: any) => {
        console.error('Error fetching email senders', error);
        this.isLoading = false;
      }
    );
  }
  private bouncifyApiUrl = 'https://api.bouncify.io/v1/verify';
  verifyEmail(email: string) {
    const apiKey = 'zm188nmugx9ptyyojki37qvjnvayo6xj';  // Replace with your actual API key
    const url = `${this.bouncifyApiUrl}?apikey=${apiKey}&email=${email}`;
  
    // Return an observable that can be subscribed to in the addRecipient method
    return this.http.get(url);
  }
  
  
  getDisplayValue(sender: Sender): string {
    return sender ? `${sender.first_name} ${sender.last_name} <${sender.username}>` : '';
  }

  addRecipient(): void {
    if (this.newRecipient && !this.emailData.recipients.includes(this.newRecipient)) {
      // Call the email verification API before adding the recipient
      this.verifyEmail(this.newRecipient).subscribe(
        (response: any) => {
          if (response.result === 'deliverable') {
            // If email is deliverable, add it to the recipients list
            this.emailData.recipients.push(this.newRecipient);
            this.snackbar.open('Recipient email verified and added.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['custom-snackbar', 'snackbar-success'],
            });
            this.newRecipient = ''; // Clear the input field
          } else {
            // If email is not deliverable, show an error message
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
  }
  

  removeRecipient(recipient: string): void {
    this.emailData.recipients = this.emailData.recipients.filter(r => r !== recipient);
  }

  sendBulkEmails(): void {
    if (!this.emailSubject || !this.editorData) {
      console.error('Subject and message body are required.');
      alert('Please fill in both subject and message.');
      return;
    }
  
    // Filter out invalid recipient values
    const validRecipients = this.emailData.recipients
      .filter(email => typeof email === 'string' && email.trim() !== '');
  
    if (validRecipients.length === 0) {
      console.error('At least one valid recipient is required.');
      alert('Please add at least one valid recipient email address.');
      return;
    }
  
    // Verifying all recipients' emails before proceeding to send emails
    const invalidEmails: string[] = [];
    const validEmails: string[] = [];
  
    const emailVerificationPromises = validRecipients.map((email) =>
      this.verifyEmail(email).toPromise().then(
        (response: any) => {
          if (response.result === 'deliverable') {
            validEmails.push(email);
          } else {
            invalidEmails.push(email);
          }
        },
        (error) => {
          console.error(`Error verifying email ${email}:`, error);
          invalidEmails.push(email);
        }
      )
    );
  
    // After verifying all recipients, proceed with sending emails only to valid recipients
    Promise.all(emailVerificationPromises).then(() => {
      if (invalidEmails.length > 0) {
        this.snackbar.open(`The following emails are invalid or undeliverable: ${invalidEmails.join(', ')}`, 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-warning'],
        });
      }
  
      if (validEmails.length === 0) {
        console.error('No valid recipients to send emails.');
        alert('No valid recipients to send emails.');
        return;
      }
  
      if (this.selectedSender) {
        const emailData = {
          from: this.selectedSender.username,
          fromName: `${this.selectedSender.first_name} ${this.selectedSender.last_name}`,
          subject: this.emailSubject,
          message: this.editorData,
          smtp: {
            host: this.selectedSender.host,
            username: this.selectedSender.username,
            password: this.selectedSender.password
          },
          api: this.userapi_key,
          sent_at: new Date().toISOString(), // Use ISO string for timestamp
          recipients: validEmails.map(email => ({ to: email, to_name: '' }))
        };
  
        this.emailService.sendBulkEmails(emailData).subscribe(
          (response: any) => {
            console.log('Bulk emails sent successfully:', response);
  
            // Handling singular/plural cases
            const emailCount = response.successful;
            if (emailCount > 0) {
              const successMessage = emailCount === 1 
                ? '1 email sent successfully.' 
                : `${emailCount} emails sent successfully.`;
  
              this.snackbar.open(successMessage, 'Close', {
                duration: 4000,
                verticalPosition: 'top',
                panelClass: ['custom-snackbar', 'snackbar-success'],
              });
            }
  
            if (response.failed.length > 0) {
              response.failed.forEach((failure: any) => {
                this.snackbar.open(`Failed to send to ${failure.to}: ${failure.error}`, 'Close', {
                  duration: 4000,
                  verticalPosition: 'top',
                  panelClass: ['custom-snackbar', 'snackbar-error'],
                });
              });
            }
            this.dialogRef.close();
          },
          (error: any) => {
            console.error('Error sending bulk emails:', error);
            this.snackbar.open('Error sending bulk emails. Please check the console for details.', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
              panelClass: ['custom-snackbar', 'snackbar-error'],
            });
            this.dialogRef.close();
          }
        );
      } else {
        console.error('Selected sender is required.');
        alert('Please select a sender.');
      }
    });
  }
  
  
  
 openDialog(): void {
  const dialogRef = this.dialog.open(EmailselectionComponent, {
    width: '600px',
    data: { sequenceSteps: this.sequenceSteps },
  });

  dialogRef.afterClosed().subscribe((result: SequenceStep) => {
    if (result) {
      this.sequenceSteps.push(result); // Push the correctly typed step
    }
  });
}

addToSequence(): void {
  if (this.emailData.recipients.length === 0) {
    this.snackbar.open('No contacts selected. Please add recipients first.', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar', 'snackbar-warning'],
    });
    return;
  }

  const dialogRef = this.dialog.open(EmailselectionComponent, {
    width: '600px',
    data: { recipients: this.emailData.recipients, sequences: this.sequenceSteps }
  });

  dialogRef.afterClosed().subscribe((result: { sequence: SequenceStep, recipients: string[] }) => {
    if (result && result.sequence) {
      console.log('Assigned contacts to sequence:', result);
      console.log('Sequence Steps:', this.sequenceSteps);

      // Here you can make an API call to update the sequence in the backend
      this.assignContactsToSequence(result.sequence, result.recipients);
    }
  });
}
assignContactsToSequence(sequence: SequenceStep, recipients: string[]): void {
  const requestData = {
    sequenceId: sequence.type, // Use appropriate identifier for the sequence
    recipients
  };

  this.http.post('http://192.168.0.232:8080/preformatted', requestData).subscribe(
    (response) => {
      console.log('API Response:', response);
      this.snackbar.open('Contacts successfully assigned to sequence.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-success'],
      });
    },
    (error) => {
      console.error('API Error:', error);
      this.snackbar.open('Error assigning contacts to sequence. Please try again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-error'],
      });
    }
  );
  
}


loadPreformattedEmails(): void {
  this.emailService.getPreformattedEmails().subscribe(
    (response) => {
      this.preformattedEmails = response;
      console.log(response,'this si the response of stored emails');
      
    },
    (error) => console.error('Error loading preformatted emails:', error)
  );
}

sendData() {
  // Ensure you're accessing a specific item from the sequenceSteps array
  const step = this.sequenceSteps[0]; // or any specific index that you're working with

  const requestBody = {
    id: 1,
    name: step.name,        // Accessing the 'name' property from the object
    type: step.type,        // Accessing the 'type' property from the object
    subject: step.subject,  // Accessing the 'subject' property from the object
    content: step.content,  // Accessing the 'content' property from the object
  };

  this.http.post('http://192.168.0.232:8080/preformatted', requestBody).subscribe(
    (response) => {
      console.log('API Response:', response);
      this.snackbar.open('Contacts successfully assigned to sequence.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-success'],
      });
    },
    (error) => {
      console.error('API Error:', error);
      this.snackbar.open('Error assigning contacts to sequence. Please try again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-error'],
      });
    }
  );
}

}
