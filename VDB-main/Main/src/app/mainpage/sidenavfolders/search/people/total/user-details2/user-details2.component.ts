import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../get-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user-details2',
  templateUrl: './user-details2.component.html',
  styleUrls: ['./user-details2.component.css']
})
export class UserDetails2Component {
  userProspectLink: string = '';
  userDetails: any;
  selectedUserDetails: any;
  isLoading: boolean = true;
  progressValue: number = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: GetDataService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UserDetailsComponent>
  ) {

    this.route.paramMap.subscribe(params => {
      const prospectLink = params.get('prospectLink');
      // Now you can fetch user details based on the prospectLink
    });
  }

  ngOnInit(): void {
    this.userProspectLink = this.data.editData;
    this.startProgressBar();
    this.fetchAllDetailsForUser(this.userProspectLink);
  }

  onUserNameClick(prospectLink: string): void {
    // Reset progress bar on user click
    this.progressValue = 0;
    this.startProgressBar();

    this.fetchAllDetailsForUser(prospectLink);
    console.log('this is the prospect link', prospectLink);
  }

  fetchAllDetailsForUser(userProspectLink: string): void {
    
    this.apiService.getAllDetailsForUser(userProspectLink).subscribe(
      (data) => {
        this.isLoading = false;
        this.selectedUserDetails = data; // Adjust based on the actual structure of the API response
        console.log('User details: userdetails2 component', this.selectedUserDetails);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  startProgressBar() {
    const interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 50; 
      } else {
        clearInterval(interval);
      }
    }, 1000); 
  }
}