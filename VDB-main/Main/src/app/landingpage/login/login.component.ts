import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import { AuthService } from 'src/app/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loading: boolean = true;
  myReactiveForm: FormGroup;
  isPasswordVisible: boolean = false;
  transitionVisible: boolean = false; // Flag to trigger animation

  constructor(
    private fb: FormBuilder,
    private apiService: GetDataService,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.myReactiveForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    window.addEventListener('load', () => {
      this.loading = false;
    });

    this.authService.initGoogleAuth();
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe !== null) {
      this.myReactiveForm.patchValue({ rememberMe: JSON.parse(rememberMe) });
    }
  }

  async onSubmit() {
    const emailControl = this.myReactiveForm.get('email');
    const passwordControl = this.myReactiveForm.get('password');

    if (emailControl && passwordControl && emailControl.valid && passwordControl.valid) {
      try {
        const ip = await this.getIPAddress();
        const loginData = {
          ...this.myReactiveForm.value,
          ip
        };

        this.apiService.loginUser(loginData).subscribe(
          async (response: any) => {
            if (response.token && response.user) {
              // Fetch location based on latitude and longitude
              const location = await this.getLocationFromCoordinates(response.user.latitude, response.user.longitude);
              
              this.transitionVisible = true; // Trigger animation
              setTimeout(() => {
                localStorage.setItem('rememberMe', JSON.stringify(this.myReactiveForm.value.rememberMe));
                localStorage.setItem('email', response.user.email);
                localStorage.setItem('firstName', response.user.firstName);
                localStorage.setItem('lastName', response.user.lastName);
                localStorage.setItem('api_key', response.user.api_key);
                localStorage.setItem('credit', response.user.credit);
                localStorage.setItem('last_login', response.user.last_login);
                localStorage.setItem('latitude', response.user.latitude);
                localStorage.setItem('longitude', response.user.longitude);
                localStorage.setItem('location', location);

                this.snackbar.open('You have logged in successfully', 'Close', {
                  duration: 4000,
                });
                this.router.navigate(['home']);
              }, 300); 
            } else {
              console.error('Invalid response format:', response);
              this.snackbar.open('Invalid response from server. Please try again later.', 'Close', {
                duration: 4000,
              });
            }
          },
          (error) => {
            console.error('Error occurred during login:', error);
            if (error.status === 401) {
              this.snackbar.open('Invalid email or password. Please try again.', 'Close', {
                duration: 4000,
              });
            } else if (error.status === 404) {
              this.snackbar.open('User not found. Please register or check your credentials.', 'Close', {
                duration: 4000,
              });
            } else {
              this.snackbar.open('You are already logged in on another device. Please log out from that device first.', 'Close', {
                duration: 4000,
              });
            }
          }
        );
      } catch (error) {
        console.error('Error getting IP address:', error);
        this.snackbar.open('Could not retrieve IP address. Proceeding without it.', 'Close', {
          duration: 4000,
        });
        // Proceed with login without IP address
        const loginData = this.myReactiveForm.value;
        this.apiService.loginUser(loginData).subscribe(
          async (response: any) => {
            if (response.token && response.user) {
              // Fetch location based on latitude and longitude
              const location = await this.getLocationFromCoordinates(response.user.latitude, response.user.longitude);
              console.log('Location',location);  
              this.transitionVisible = true; // Trigger animation
              setTimeout(() => {
                localStorage.setItem('rememberMe', JSON.stringify(this.myReactiveForm.value.rememberMe));
                localStorage.setItem('email', response.user.email);
                localStorage.setItem('firstName', response.user.firstName);
                localStorage.setItem('lastName', response.user.lastName);
                localStorage.setItem('api_key', response.user.api_key);
                localStorage.setItem('credit', response.user.credit);
                localStorage.setItem('last_login', response.user.last_login);
                localStorage.setItem('latitude', response.user.latitude);
                localStorage.setItem('longitude', response.user.longitude);
                localStorage.setItem('location', location);

                this.snackbar.open('You have logged in successfully', 'Close', {
                  duration: 4000,
                });
                this.router.navigate(['home']);
              }, 300); 
            } else {
              console.error('Invalid response format:', response);
              this.snackbar.open('Invalid response from server. Please try again later.', 'Close', {
                duration: 4000,
              });
            }
          },
          (error) => {
            console.error('Error occurred during login:', error);
            if (error.status === 401) {
              this.snackbar.open('Invalid email or password. Please try again.', 'Close', {
                duration: 4000,
              });
            } else if (error.status === 404) {
              this.snackbar.open('User not found. Please register or check your credentials.', 'Close', {
                duration: 4000,
              });
            } else {
              this.snackbar.open('An error occurred. Please try again later.', 'Close', {
                duration: 4000,
              });
            }
          }
        );
      }
    } else {
      this.myReactiveForm.markAllAsTouched();
      this.snackbar.open('Please enter a valid email and password.', 'Close', {
        duration: 4000,
      });
    }
  }

  getIPAddress(): Promise<string> {
    return fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip);
  }

  getLocationFromCoordinates(lat: number, lng: number): Promise<string> {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name;
        return address ? address : 'Unknown location';
      })
      .catch(() => 'Unknown location');
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
  }}