import { HttpClient } from '@angular/common/http';
import { Component, NgZone, ViewChild, inject } from '@angular/core';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import jsPDF from 'jspdf';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatChipGrid, MatChipInputEvent } from '@angular/material/chips';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  pdfPath!: string;
  agreedToTerms: boolean = false;



  ngOnInit(): void {
    // this.http.get<{ pdfPath: string }>('/api')
    //   .subscribe(response => {
    //     this.pdfPath = response.pdfPath;
    //   });
  }
  email!: string;

  constructor(private signupService: GetDataService, private router: Router,private http: HttpClient,private snackbar:MatSnackBar) {}

  // submitForm() {
  //   this.signupService.signup(this.email).subscribe(
  //     () => {
  //       console.log('Signup successful');
  //       // Redirect to login page
  //       // this.router.navigate(['/login']);
  //       this.snackbar.open('Please check your mail to activate your account', 'Close', {
  //         duration: 10000,
  //       });
  //     },
  //     error => {
  //       console.error('Error occurred during signup', error);
  //       if (error.status === 400 && error.error.includes('553-5.1.3')) {
  //         // Handle invalid email error
  //         this.snackbar.open('Please enter a valid email address.', 'Close', {
  //           duration: 4000,
  //         });
  //       } else {
  //         // Handle other errors
  //         // Display a generic error message
  //         this.snackbar.open('Please enter valid mail id.', 'Close', {
  //           duration: 4000,
  //         });
  //       }
  //     }
  //   );
  // }
  
}



  
  

  





  








