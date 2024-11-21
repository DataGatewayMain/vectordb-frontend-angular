import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  private countryFilterSubject = new BehaviorSubject<string>('');
  countryFilter$ = this.countryFilterSubject.asObservable();

  setCountryFilter(filter: string) {
    console.log('Received filter:', filter);
    this.countryFilterSubject.next(filter);
  }
  
}
