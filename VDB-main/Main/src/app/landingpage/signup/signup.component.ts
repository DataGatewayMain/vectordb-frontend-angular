import { Component, NgZone, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import { GoogleAuthService } from 'src/app/google-auth.service';
import { jsDocComment } from '@angular/compiler';

declare var google :any
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  agreeTerms: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private getDataService: GetDataService) {}

  submitForm() {
    if (this.email && this.agreeTerms) {
      this.getDataService.registerUser({ email: this.email }).subscribe(
        (response) => {
          this.successMessage = 'Email is sent successfully! Thank you for signing up.';
          this.errorMessage = '';
          console.log('Signup successful', response);
          console.log(this.email,'this email');
          
        },
        (error) => {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          this.successMessage = '';
          if (error.status === 400) {
            this.errorMessage = 'Error: Bad Request. Please enter a valid email address.';
          } else if (error.status === 500) {
            this.errorMessage = 'Error: Internal Server Error. Please try again later.';
          }
          console.error('Signup failed', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid email address and accept the terms to proceed.';
      this.successMessage = '';
    }
  }
}
