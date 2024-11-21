import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-how-canwehelp',
  templateUrl: './how-canwehelp.component.html',
  styleUrls: ['./how-canwehelp.component.css']
})
export class HowCanwehelpComponent implements OnInit {



constructor(private getservice:GetDataService){

}
  ngOnInit(): void {

  }




}
