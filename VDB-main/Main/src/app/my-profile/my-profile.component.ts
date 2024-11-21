import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  password: any;
  userEmail: any;
  userFirstName: any;
  userapi_key: any;
  usercredit: any;
  userLastName: any;
  dialogRef: any;
  successMessage: string = ''; // Add this line

  constructor(public dialog: Dialog, private userService: GetDataService) {}

  ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName');
    this.password = localStorage.getItem('password');
    this.userEmail = localStorage.getItem('email');
    this.userLastName = localStorage.getItem('lastName');
    this.userapi_key = localStorage.getItem('api_key');
    this.usercredit = localStorage.getItem('credit');
  }

  openDialogForEmail() {
    const dialogg = this.dialog.open(ChangeEmailComponent, {});
  }

  openDialogForPassword() {
    const dialogp = this.dialog.open(ChangePasswordComponent, {});
  }

  updatePassword(): void {
    this.userService.resetPassword(this.userEmail)
      .subscribe(
        response => {
          console.log('Password reset email sent successfully:', response);
          this.successMessage = `Email was sent to: ${this.userEmail}. Haven’t seen the email? Check your spam or resend email.`;
        },
        error => {
          console.error('Failed to reset password:', error);
        }
      );
  }
}
