import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json')
httpOptions={
headers:this.headers
}

  // private baseUrl = 'http://192.168.0.5:8080/api/register';

  private url="http://localhost:3000/login/addTodo"
  private loginurl="http://localhost:3000/login/login"
  constructor(private http: HttpClient) { }

 
  signup(user: object): Observable<any> {
    console.log(user,"signupdata");
    const headers = new HttpHeaders({'Content-Type': 'application/json'}); // Set content type to JSON
    return this.http.post(`${this.url}`, user, { headers });
   
    
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${this.loginurl}`, credentials, { headers });
  }



}
