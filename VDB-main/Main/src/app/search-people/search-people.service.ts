// search-people.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchPeopleService {
  private apiUrl = 'http://192.168.0.5/PHP-API/api.php';

  constructor(private http: HttpClient) {}

  searchRecords(filters: any, page: number = 1): Observable<any> {
    // Add page parameter to the API request
    return this.http.get(`${this.apiUrl}?page=${page}`, { params: filters });
  }
}
