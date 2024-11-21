import { Component } from '@angular/core';
import { DataFilterService } from 'src/data-filter.service';

// import { filterService } from './get-data.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  countryFilter: string = '';

 constructor(private filterService: DataFilterService) {}


 }  
