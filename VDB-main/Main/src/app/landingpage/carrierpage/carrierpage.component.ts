import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplypageComponent } from '../applypage/applypage.component';

@Component({
  selector: 'app-carrierpage',
  templateUrl: './carrierpage.component.html',
  styleUrls: ['./carrierpage.component.css']
})
export class CarrierpageComponent   {
  
  constructor(public dialog: MatDialog) {}
  selectedLocation: string=''

  searchTerm: string = ''; 

  location=[
    {"location":"pune,IND"}
  
  ]

job=[
  {
    
    "id": 1,
    "title": "Quality Analyst ",
    "opening":" 3",
    "experience": "2+",
    "location":"Pune, IND",
    "info":"More Info",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 2,
    "title": "Team Lead  ",
    "opening":"1",
    "experience": "2+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 3,
    "title": "IT Developer",
    "opening":"5",
    "experience": "1+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 4,
    "title": "Data Research",
    "opening":"10",
    "experience": "1+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 5,
    "title": "Manager ",
    "opening":"1",
    "experience": "3+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 6,
    "title": "Team Lead  ",
    "opening":"2",
    "experience": "2+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  }, {
    
    "id": 7,
    "title": "Generation Executive",
    "opening":"2",
    "experience": "2+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 8,
    "title": "Management Information system ",
    "opening":"3",
    "experience": "1+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 9,
    "title": "HR Executive ",
    "opening":"2",
    "experience": "1+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },
  {
    
    "id": 10,
    "title": "HR Manager ",
    "opening":"1",
    "experience": "2+",
    "location":"Pune, IND",
    "info":"",
    'apply':'https://www.google.com/'
  },]

  openDialog(){
    const dialogRef = this.dialog.open(ApplypageComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }


}



