import { Component } from '@angular/core';
import { SearchPeopleService } from './search-people.service';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent {
   filters: any = {};
  results: any = [];
  currentPage: number = 1;

  ngOnInit(): void {
    // Initialize any necessary data or actions on component initialization
    this.search(); // Optional: Load data on component initialization
  }

  constructor(private apiService: SearchPeopleService) {}

  search(): void {
    this.apiService.searchRecords(this.filters, this.currentPage).subscribe((data) => {
      this.results = data;
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.results.total_pages) {
      this.currentPage = page;
      this.search();
    }
  }
}