import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { driver } from 'driver.js';

@Component({
  selector: 'app-helpcomponent',
  templateUrl: './helpcomponent.component.html',
  styleUrls: ['./helpcomponent.component.css']
})
export class HelpcomponentComponent {
  userFirstName: string | null = '';
  userLastName: string | null = '';
  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName');
    this.userLastName = localStorage.getItem('lastName');

  }

  tourGuide() {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous'],
      steps: [
        { element: '.allFilters', popover: { title: 'Apply Filters', description: 'Use Filters to build a targeted list of the best prospects.', side: "left", align: 'start' }},
        { element: '.components', popover: { title: 'Saved Contacts', description: `Use the Saved tab to take actions on contacts that you've already saved, and the Net New tab to find people that you have not added yet.`, side: "bottom", align: 'start' }},
        { element: '.peopleCompaniesSavedList', popover: { title: 'Save your Progress', description: 'Organize your contacts by saving them to lists.', side: "bottom", align: 'start' }},
        { element: '.searchSavedSearches', popover: { title: 'Save your searches', description: 'Save time searching for new contacts with Saved Searches', side: "left", align: 'start' }},
      ]
    });
    driverObj.drive();
  }

}
