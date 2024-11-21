import { U } from '@angular/cdk/keycodes';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService implements OnInit {
  ngOnInit(){
  this.getCurrentFilters()
  console.log(this.filtersSubject,'filter subject');
  }
  
  private filtersSubject = new BehaviorSubject<any>({});
  // private filtersSubject = new BehaviorSubject<any>({ include_job_title: [] });
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: any): void {
    // Merge the new filters with the existing ones
    const mergedFilters = { ...this.filtersSubject.value, ...filters };
    this.filtersSubject.next(mergedFilters);

    this.filtersSubject.next(filters);
  }
  

  getCurrentFilters(): any {
    return this.filtersSubject.value;
  }

}


