import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../services/service.service';
// import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-more-infopage',
  templateUrl: './more-infopage.component.html',
  styleUrls: ['./more-infopage.component.css']
})
export class MoreInfopageComponent   {
  info:any
  constructor(private router:ActivatedRoute,private service:ServiceService){

  }
  ngOnInit(): void {
    let id=this.router.snapshot.params['id']
    this.service.get(id).subscribe((res:any)=>{
console.log(res,'res');
this.info=res
    })
  }



  
}
