import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/landingpage/services/user.service';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent {
  password: any;
  userEmail: any;
  userFirstName: any;
  userLastName: any;

  constructor(
    public dialog: Dialog,
    private userService: GetDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Retrieve user details from local storage
    this.userFirstName = localStorage.getItem('firstName') || '';
    this.password = localStorage.getItem('password') || '';
    this.userEmail = localStorage.getItem('email') || '';
    this.userLastName = localStorage.getItem('lastName') || '';
  }

  checkEmailAvailability(): void {
    const emailToCheck = this.userEmail;
    console.log('Email to check:', emailToCheck);
  
  }
  
}
