import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDataService } from './get-data.service';
import { ChangeDetectionStrategy } from '@angular/core';
import * as XLSX from 'xlsx';

import saveAs from 'file-saver';
import * as FileSaver from 'file-saver';
import { FilterService } from '../filters/filter.service';
import { GuideComponent } from 'src/app/guide/guide.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  
})
export class PeopleComponent {
  filters: any = {};
  results: any = [];
  currentPage: number = 1;
  Useremail:any
  constructor(private apiService: GetDataService, private filterService: FilterService, private dialog:MatDialog) {}

  ngOnInit(): void {
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
    
    });
  }
  openGuideDialog(){
    let dialogRef= this.dialog.open(GuideComponent,{
      data :{ },
        height: '500px',
        width: '350px',
        position: { right: '150px', top: '290px',bottom:'0px' }
      });
  }
}