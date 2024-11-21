import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private getDataService: GetDataService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value;

    // Clear previous messages
    this.successMessage = null;
    this.errorMessage = null;

    this.getDataService.resetPassword(email).subscribe(
      response => {
        // Set success message
        this.successMessage = 'Password reset link has been sent to your email address!';

        // Redirect after a delay to ensure the message is visible
        setTimeout(() => {
          this.router.navigate(['/']);  // Change '/' to the desired path if needed
        }, 3000);  // Delay should match or exceed the message display duration
      },
      error => {
        // Set error message
        console.error('Error:', error);
        this.errorMessage = 'Failed to send password reset email. Please check your internet connection and try again.';
      }
    );
  }
}
