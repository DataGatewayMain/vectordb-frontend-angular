import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDataService } from '../get-data.service';
import { FilterService } from '../../filters/filter.service';
import { MatDialog } from '@angular/material/dialog';
import { GuideComponent } from 'src/app/guide/guide.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-rigth-sidenetnew-saved-total',
  templateUrl: './rigth-sidenetnew-saved-total.component.html',
  styleUrls: ['./rigth-sidenetnew-saved-total.component.css'],
})
export class RigthSidenetnewSavedTotalComponent implements OnInit {
  filters: any = {};
  currentPage: number = 1;
  selectedRows: any[] = [];
  savedRecordsCount: number = 0;
  net_new_count: number = 0;
  total_count: number = 0;
  savedData: any;
  total_records = 0;
  itemsPerPage: number = 50;
  private currentFilters: any = {}; 
  displayedData: any;
  total_count1: any;
  net_new_count1: any;

  constructor(
    private router: Router,
    private apiService: GetDataService,
    private filterService: FilterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
  
    }

    this.filterService.filters$
      .pipe(
        debounceTime(300), 
        distinctUntilChanged() 
      )
      .subscribe((filters) => {
        if (!this.filtersAreEqual(filters, this.currentFilters)) {
          this.currentFilters = filters;
          this.fetchCounts();
        }
      });

      console.log(this.savedRecordsCount,'this is the saverecords count');
      
  }
  isPeopleRoute(): boolean {
    const segments: string[] = this.router.url.split('/');
    return segments.includes('right');
  }

  getDataForCurrentPage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.savedData.length);
    this.displayedData = this.savedData.slice(startIndex, endIndex);
  }

 

  private filtersAreEqual(filters1: any, filters2: any): boolean {
   
    return false; 
  }

  openGuideDialog() {
    let dialogRef = this.dialog.open(GuideComponent, {
      data: {},
      height: '500px',
      width: '350px',
      position: { right: '150px', top: '290px', bottom: '0px' },
    });
  }

  fetchCounts(): void {
  this.fetchSavedCount(this.currentFilters);
  this.fetchtotalCount(this.currentFilters);
  this.fetchnewCount(this.currentFilters);
}

fetchSavedCount(filters: any): void {
  this.apiService.savedsearch(filters).subscribe((response) => {
    if (response && response.saved_count ) {
      this.savedRecordsCount = response.saved_count;
    } else {
      console.warn('Unexpected server response. No saved_count property found.');
    }
  });
}


fetchtotalCount(filters: any): void {
  this.apiService.totalsearch(filters).subscribe((response) => {
    if (response && response.total_count) {
       this.total_count1 = response.total_count;
    } else {
      console.warn('Unexpected server response. No saved_count property found.');
    }
  });
}

fetchnewCount(filters: any): void {
  this.apiService.net_new_search(filters).subscribe((response) => {
    if (response && response.net_new_count) {
        this.net_new_count1 = response.net_new_count;
    } else {
      console.warn('Unexpected server response. No saved_count property found.');
    }
  });
}
}
