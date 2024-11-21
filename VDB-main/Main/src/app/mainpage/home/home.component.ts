import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/notification/notification.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { GetDataService } from '../sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent {
  password: any;
  userEmail: any;
  userFirstName: any;
  userLastName:any
  dialogRef: any;
  showLabels: boolean = false;
  isSidenavOpened: boolean = true;
  filters: any = { include_First_Name: '', include_Employee_Size: [], exclude_Employee_Size: [] };
  searchInput:any
    location: string | null | undefined;
  constructor(public dialog: MatDialog,private router:Router,private renderer: Renderer2,private apiservice:GetDataService){
    }
    ngOnInit(): void {
        this.userFirstName = localStorage.getItem('firstName');
        this.password = localStorage.getItem('password');
        this.userEmail = localStorage.getItem('email');
        this.userLastName=localStorage.getItem('lastName');
        this.location=localStorage.getItem('location')
    }
    isNavbarCollapsed = true;
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
    toggleNavbar() {
      this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }
    openUserDialog() {
      this.dialogRef = this.dialog.open(NotificationComponent,
        {
         
          height: '1050px',
          width: '450px',
          position: { right: '0px', top: '0px',bottom:'0px' }
        });
    }
    buttontoggle(){
      this.showLabels=false
    }
   
  logout() {
    this.apiservice.logout().subscribe(
      (response) => {
        if (response.logout === true) {
          localStorage.removeItem('email');
          localStorage.removeItem('firstName');
          localStorage.removeItem('lastName');
          this.router.navigate(['login']);
        }
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }
    performSearch() {
      const filters = {
        include_First_Name: this.filters.include_First_Name,
        include_last_name: this.filters.include_last_name,
        searchInput: this.searchInput,
      };
      console.log('Performing search with filters:', filters);
    }
    isSidebarExpanded: boolean = false;
    isSidebarOpen: boolean = false;
    expandSidebar() {
      this.isSidebarExpanded = true;
    }
    collapseSidebar() {
      this.isSidebarExpanded = false;
    }
    openNav() {
      this.isSidebarOpen = true;
    }
    closeNav() {
      this.isSidebarOpen = false;
    }
   sidebar = document.getElementById("mySidebar");
    if (sidebar:any) {
      sidebar.addEventListener('mouseenter', () => {
        this.openNav();
      });
      sidebar.addEventListener('mouseleave', () => {
        this.closeNav();
      });
    }
  
    opened = true;
  }
  