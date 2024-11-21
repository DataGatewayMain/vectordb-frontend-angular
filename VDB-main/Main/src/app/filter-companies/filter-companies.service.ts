import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class FilterCompaniesService {
  private filtersSubject = new BehaviorSubject<any>({});
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: any): void {
    this.filtersSubject.next(filters);
  }

  getCurrentFilters(): any {
    return this.filtersSubject.value;
  }

}
