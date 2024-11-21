import { Component, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { AuthService } from '../auth.service';
import saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dialogue-save',
  templateUrl: './dialogue-save.component.html',
  styleUrls: ['./dialogue-save.component.css']
})
export class DialogueSaveComponent {
  filters: any;
  selectedRows: any[] = [];
  isDataSaved: boolean = false;

  @ViewChild('exportCompleteDialog') exportCompleteDialog!: TemplateRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private apiService: GetDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogueSaveComponent>,
    private dialog: MatDialog,
    private http:HttpClient
  ) {
    if (this.data && this.data.selectedRows) {
      this.selectedRows = this.data.selectedRows;
    }
  }

  saveData(): void {
    this.apiService.saveDataToUserAccount1(this.selectedRows)
      .subscribe(
        (response) => {
          this.isDataSaved = true;
          this.snackBar.open('Record Saved', 'Close', { duration: 2000, verticalPosition: 'top', panelClass: 'my-custom-snackbar' });
          this.closeDialog(); // Close the existing dialog
          this.openExportCompleteDialog(); // Open the export complete dialog
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  openExportCompleteDialog(): void {
    this.dialog.open(this.exportCompleteDialog, {
      width: '400px'
    });
  }

  closeExportCompleteDialog(): void {
    this.dialog.closeAll(); // Close all dialogs
  }

  exportToCSV(): void {
    if (this.selectedRows.length === 0) {
        this.snackBar.open('No rows selected for export', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['custom-snackbar', 'snackbar-warning'],
        });
        return;
    }

    const filters = this.filters;
    const apikey = localStorage.getItem('api_key'); // Get API key from localStorage

    this.apiService.exportToCSV(filters, this.selectedRows).subscribe(
        (data: BlobPart) => {
            // Create a CSV Blob
            const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, 'exported_data.csv');

            // Save export history to the database
            if (apikey) {
                this.saveExportHistory(apikey, this.selectedRows).then(() => {
                    this.snackBar.open('Data has been exported', 'Close', {
                        duration: 4000,
                        verticalPosition: 'top',
                        panelClass: ['custom-snackbar', 'snackbar-success'],
                    });
                }).catch((error) => {
                    console.error('Error saving export history:', error);
                    this.snackBar.open('Export successful, but error saving to database', 'Close', {
                        duration: 4000,
                        verticalPosition: 'top',
                        panelClass: ['custom-snackbar', 'snackbar-error'],
                    });
                });
            } else {
                console.error('API key not found in localStorage');
                this.snackBar.open('Export successful, but API key not found', 'Close', {
                    duration: 4000,
                    verticalPosition: 'top',
                    panelClass: ['custom-snackbar', 'snackbar-warning'],
                });
            }

            this.dialog.closeAll();
        },
        (error: any) => {
            console.error('Error exporting data:', error);
            this.snackBar.open('Error exporting data', 'Close', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['custom-snackbar', 'snackbar-error'],
            });
        }
    );
}

private saveExportHistory(apikey: string, dataToExport: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.post('http://192.168.0.7:4000/saveExportHistory', { apikey, dataToExport }, { responseType: 'text' })
            .subscribe(
              (                response: any) => {
                    console.log('Export history saved successfully:', response);
                    resolve();
                },
              (                error: any) => {
                    console.error('Error saving history:', error);
                    reject(error);
                }
            );
    });
}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
