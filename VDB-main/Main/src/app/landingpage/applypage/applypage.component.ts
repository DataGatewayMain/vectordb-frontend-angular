import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-applypage',
  templateUrl: './applypage.component.html',
  styleUrls: ['./applypage.component.css']
})
export class ApplypageComponent {
  myReactiveForm: FormGroup;

  constructor(private fb: FormBuilder,private dialogRef: MatDialogRef<ApplypageComponent>) {
    this.myReactiveForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      number:['',[Validators.required]],
      position:['',[Validators.required]],
      location:['',[Validators.required]],
      city:['',[Validators.required]],
      cv:['',[Validators.required]]
    });
  }
     

  closeDialog() {
    this.dialogRef.close();
  }

  
  OnSubmit() {
    const emailControl = this.myReactiveForm.get('email');
    
  console.log(this.myReactiveForm.value,'data');
  this.myReactiveForm.reset()
  this.closeDialog();
  
  }



  departments = [
    {"departments":"QA Analyst"  },
    {"departments":"Data Analyst" },
    {"departments":"Data Research Analyst"  },
    {"departments":"Team Lead- QA"  },
    {"departments":"Team Lead- Operations"  },
    {'departments':"IT Developer"},
    {'departments':"MIS Executiv"},
    {'departments':"Appointment Generation Executive"},
    {'departments':"Manager - Operations"},
    {'departments':"HR Executive"},
    {'departments':"HR Manager"},

  ];
}
