import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-request-demo',
  templateUrl: './request-demo.component.html',
  styleUrls: ['./request-demo.component.css']
})
export class RequestDemoComponent {
  myReactiveForm: FormGroup;

  constructor(private fb: FormBuilder,private userService:UserService) {
    this.myReactiveForm = this.fb.group({
      name:['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      companyName:['',Validators.required]
    });
  }
     

  

  
  OnSubmit() {
   
  console.log(this.myReactiveForm.value,'contraol');
  this.userService.login(this.myReactiveForm.value).subscribe(() => {
  
  });
  this.myReactiveForm.reset()
}

  
}
