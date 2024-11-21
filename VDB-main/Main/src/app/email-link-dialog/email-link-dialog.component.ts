import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-email-link-dialog',
  standalone: true,
  templateUrl: './email-link-dialog.component.html',
  styleUrls: ['./email-link-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class EmailLinkDialogComponent {
  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  verificationStatus: string = '';
  formVisible: boolean = true;
  searchTerm: string = '';
  serviceProviders: any[] = [];
  errorMessage: string = '';
  password: string = '';
  username: string = '';  // Added property for username
  host: string = '';      // Added property for host
  api: string = '';       // Added property for API key
  firstName: string = ''; // Added property for first name
  lastName: string = '';  // Added property for last name
  emailForm: FormGroup;
  
  private bouncifyApiUrl = 'https://api.bouncify.io/v1/verify';
  private vectorDbApiUrl = 'https://api.vectordb.app/v1/email-enrichment';

  constructor(private http: HttpClient, private getdataservice: GetDataService,private fb :FormBuilder,private snackbar:MatSnackBar,private dialog: MatDialog) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName:['',],
      lastName:['']
    });
console.log(this.emailForm,'this is the email form');

  }

  onEmailChange(email: string) {
    this.email = email;
    if (this.isValidEmail(email)) {
      this.verifyEmail();
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  verifyEmail() {
    const apiKey = 'zm188nmugx9ptyyojki37qvjnvayo6xj';
    const url = `${this.bouncifyApiUrl}?apikey=${apiKey}&email=${this.email}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.result === 'deliverable') {
        this.sendOtp();
      } else {
        this.verificationStatus = 'Email is not deliverable';
      }
    }, (error: any) => {
      this.verificationStatus = 'Error verifying email';
    });
  }

  sendOtp() {
    const payload = { email: this.email };

    this.http.post(`${this.vectorDbApiUrl}/send-otp/`, payload).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.otpSent = true; // Hide "Send OTP" button
          this.verificationStatus = 'OTP sent. Please check your email.';
        } else {
          this.verificationStatus = `Error sending OTP: ${response.message}`;
        }
      },
      error: (error: any) => {
        this.verificationStatus = 'Error sending OTP';
      }
    });
  }
  
  verifyOtp() {
    const payload = { email: this.email, code: this.otp };

    this.http.post(`${this.vectorDbApiUrl}/send-otp/verify/`, payload).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.verificationStatus = 'OTP verified successfully!';
          this.formVisible = false; // Hide OTP form and show the next form
        } else {
          this.verificationStatus = `Error verifying OTP: ${response.message}`;
        }
      },
      error: (error: any) => {
        this.verificationStatus = 'Error verifying OTP';
      }
    });
  }


  searchServiceProvider(searchValue: string): void {
    console.log('Search Term:', searchValue);  // Debugging log

    if (searchValue.trim()) {
      this.errorMessage = '';  // Clear any previous error message
      this.getdataservice.getServiceProviderData(searchValue).subscribe(
        (response:  any) => {
          console.log('API Response:', response);  // Debugging log
          if (response && response.length > 0) {
            this.serviceProviders = response;
          } else {
            this.serviceProviders = [];
            this.errorMessage = `No service providers found for "${searchValue}".`;
          }
        },
        (error: any) => {
          console.error('Error fetching data:', error);
          this.errorMessage = 'An error occurred while fetching data.';
        }
      );
    } else {
      this.errorMessage = 'Please enter a service provider.';
      this.serviceProviders = [];  // Clear any previous results
    }
  }

  selectProvider(provider: any): void {
    const requestData = {
      api: localStorage.getItem('api_key'),
      first_name: this.emailForm.get('firstName')?.value || localStorage.getItem('firstName'),
      last_name: this.emailForm.get('lastName')?.value   || localStorage.getItem('lastName'), 
    
      host: provider.smtp,  // Ensure this key exists in provider
      password: this.emailForm.get('password')?.value,
      service_provider: provider.service_provider || '',
      username: this.email,
      imap: provider.imap,
      imap_port:provider.imap_port,
      smtp_port:provider.smtp_port
    };
  
    console.log('Sending requestData:', requestData);
  console.log(this.email,'eamil');
  
    this.http.post('https://api.vectordb.app/v1/email-enrichment/saved_To_Get_Email/', requestData)
    .subscribe(
      (response: any) => {
        console.log('Full Response:', response);  // Debugging log
        if (response && response.success) {
          console.log('Provider saved successfully:', response.success);
          this.snackbar.open('Email configuration done successfully..','Ok', {
            duration: 4000,
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar', 'snackbar-warning'],}
          )
          this.dialog.closeAll();
        } else {
          console.error('Error saving provider:', response ? response.error : 'Unknown error');
          this.errorMessage = response ? response.error : 'An error occurred while saving provider.';
        }
      },
      (error: any) => {
        console.error('Error saving provider:', error);
        this.errorMessage = error.message ? error.message : 'An error occurred while saving provider.';
      }
    );
  
  }
 
  onSubmit(): void {
    if (this.emailForm.valid && this.serviceProviders.length > 0) {
      this.selectProvider(this.serviceProviders[0]); // Just an example, you may want to choose a specific provider
    } else {
      this.errorMessage = 'No provider selected or form is invalid.';
    }
  }
}
  
  


