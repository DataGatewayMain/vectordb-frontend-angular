import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
  url=' http://localhost:3000/info/'

get(id:any){
  return this.http.get(this.url+id)
}



}
