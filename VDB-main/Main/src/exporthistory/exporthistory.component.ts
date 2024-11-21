import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-exporthistory',
  templateUrl: './exporthistory.component.html',
  styleUrl: './exporthistory.component.css'
})
export class ExporthistoryComponent {
  exportHistory: any = [];
  constructor(private exportHistoryService: GetDataService,private http:HttpClient,private route:ActivatedRoute,private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.loadExportHistory(); // Refresh data each time this component is loaded
    });
  }

  // Fetch and load export history data
  loadExportHistory() {
    this.exportHistoryService.getExportHistory().subscribe((data: any) => {
      // Sort the export history by `created_at` in descending order to show newest first
      this.exportHistory = data.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      console.log(this.exportHistory, 'export history'); // Check the logged output
    });
  }

  downloadCsv(id: number) {
    const apiKey = localStorage.getItem('api_key'); // Get the api_key from localStorage
    const url = `https://exporthistory.onrender.com/downloadCsv/${apiKey}/${id}`; // Update the URL to include id

    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.csv'; // Filename for downloaded file
        link.click();
      },
      (error: any) => {
        console.error('Error downloading CSV:', error);
      }
    );
  }


closeExportCompleteDialog(): void {
  this.dialog.closeAll(); // Close all dialogs
}

}
