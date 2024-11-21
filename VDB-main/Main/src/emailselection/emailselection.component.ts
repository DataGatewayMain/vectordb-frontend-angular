import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AiemailComponent } from 'src/aiemail/aiemail.component';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';
import { NewService } from 'src/app/new.service';
interface EmailOption {
  subject: string;
  content: string;
}interface SequenceStep {
  id: number;
  name: string;
  type: string;
  subject: string;
  content: string | null;
}


@Component({
  selector: 'app-emailselection',
  templateUrl: './emailselection.component.html',
  styleUrl: './emailselection.component.css'
})
export class EmailselectionComponent {
  aiGeneratedEmails = [
    {
      subject: 'AI Introduction Email',
      content: 'Hi {{name}}, I noticed your profile and wanted to connect.',
    },
    {
      subject: 'Follow-Up Email',
      content: 'Just checking in to see if you had any questions!',
    },
  ];

  preformattedEmails = [
    {
      subject: 'Quick Pitch Email',
      content: 'Hey {{name}}, here’s a quick intro to what we offer...',
    },
    {
      subject: 'Cold Outreach Email',
      content: 'Hi {{name}}, I’m reaching out to discuss...',
    },
  ];
  currentView: any;


  constructor(
    public dialogRef: MatDialogRef<EmailselectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private newService: NewService, private dialog:MatDialog,private service:GetDataService,private http:HttpClient,private snackbar:MatSnackBar
  ) {}
  ngOnInit(): void {
    // Subscribe to the newreceipent observable to get the updated data
    this.newService.getNewReceipent().subscribe((data) => {
      this.recipientData = data;  // Assign the received data
    });
    console.log(this.recipientData);  // Check if recipientData is correctly assigned
console.log(this.sequenceSteps,'this is the sequence step');  // Check if sequenceSteps is populated correctly

  }

  selectEmail(template: any, source: string): void {
    this.selectedTemplate = {
      ...template,
      type: source === 'AI' ? 'AI-Generated Email' : 'Preformatted Email',
    };
  }


  sequenceSteps: SequenceStep[] = [];
  ADDTOSEQUENCE(template: any, source: string){
    const newStep = {
      type: source === 'AI' ? 'AI-Generated Email' : 'Preformatted Email',
      day: this.data.sequenceSteps.length + 1,
      subject: template.subject,
      content: template.content,
    };
    this.dialogRef.close(newStep); 
  }
  onCancel(): void {
    this.dialogRef.close(); 
  }
  openView(viewType: string): void {
    this.currentView = viewType;
  }

  goBack(): void {
    if (this.selectedTemplate) {
      this.selectedTemplate = null; // Clear selected template
    } else {
      this.currentView = null; // Reset to initial options
    }
  }
  // Open Dialog Example
  openDialog(): void {
    const dialogRef = this.dialog.open(EmailselectionComponent, {
      autoFocus: true, // Automatically focuses on the first input element
      disableClose: false, // Allow the user to close the dialog by clicking outside
      panelClass: 'dynamic-dialog', // Add a custom class for further styling (optional)
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }
  

   
  

  selectOption(optionType: string): void {
    if (optionType === 'AI-assisted') {
      this.selectedTemplate = this.aiGeneratedEmails[0]; // Example: Show first AI email
    } else if (optionType === 'Pre-formatted') {
      this.selectedTemplate = this.preformattedEmails[0]; // Example: Show first preformatted email
    } else {
      this.selectedTemplate = {
        subject: 'Custom Sequence',
        content: 'This is a custom sequence for your needs.',
      }; // Fallback example
    }
  }




// PREFORMATED
 // Select a template (either AI-generated or preformatted)
 selectTemplate(template: EmailOption): void {
  this.selectedTemplate = template;
}


selectedTemplate: any = {
 
};

editingStepIndex: number | null = null;

// Start editing a step
editStep(step: any, index: number): void {
  this.editingStepIndex = index;
}

// Save the edited step
saveStep(index: number): void {
  this.editingStepIndex = null;
  alert('Step updated successfully!');
}

// Cancel editing
cancelEdit(): void {
  this.editingStepIndex = null;
}

// Add a new step





searchQuery: string = '';
templates: any[] = [];
filteredTemplates: any[] = [];




// Filter templates based on search
getFilteredTemplates(): void {
  this.filteredTemplates = this.templates.filter((template) =>
    template.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
}


// Preview a specific step
previewStep(step: any): void {
  alert(`Previewing: ${step.type} (Day ${step.day})`);
}

// Create and customize button action
createAndCustomize(): void {
  alert(`Creating and customizing: ${this.selectedTemplate.name}`);
}





// Store selected email templates
isLoading: boolean = false;

generateAIEmail(): void {
  this.isLoading = true;

  const prompt = 'Generate a professional email template for a cold outreach about a new software product.each time generate new email';

  this.service.generateEmail(prompt).subscribe(
    (response:any) => {
      this.isLoading = false;
      this.aiGeneratedEmails.push({
        subject: 'AI-Generated Email',
        content: response.text,
      });
    console.log(response,'this si the response from ai generated email');
    
    },

    (error:any) => {
      this.isLoading = false;
      console.error('Error generating email:', error);
    }
  );
}

// ???
editingEmailIndex: any // Track the currently edited email
editableEmail: { subject: string; content: string } | any = null; // Temporary storage for editable email

// Start editing a specific email
startEditing(index: number): void {
  this.editingEmailIndex = index;
  this.editableEmail = { ...this.aiGeneratedEmails[index] };
}

// Save the edited email
saveEmail(index: number): void {
  if (this.editableEmail) {
    this.aiGeneratedEmails[index] = { ...this.editableEmail };
    this.cancelEditing(); // Exit editing mode
  }
}

// Cancel editing and discard changes
cancelEditing(): void {
  this.editingEmailIndex = null;
  this.editableEmail = null;
}
editingPreformattedIndex: number | any = null; // Track the currently edited preformatted email
editablePreformattedEmail: { subject: string; content: string } | any = null; // Temporary storage for editable preformatted email

// Start editing a specific preformatted email
startEditingPreformatted(index: number): void {
  this.editingPreformattedIndex = index;
  this.editablePreformattedEmail = { ...this.preformattedEmails[index] };
}

// Save the edited preformatted email
savePreformattedEmail(index: number): void {
  if (this.editablePreformattedEmail) {
    this.preformattedEmails[index] = { ...this.editablePreformattedEmail };
    this.cancelEditingPreformatted(); // Exit editing mode
  }
}

// Cancel editing and discard changes
cancelEditingPreformatted(): void {
  this.editingPreformattedIndex = null;
  this.editablePreformattedEmail = null;
}
recipientData: any; 
assignContactsToSequence(sequenceSteps: SequenceStep[], recipients: string[]): void {
  // Handle the array of sequence steps
  sequenceSteps.forEach(sequence => {
    const requestData = {
      sequenceId: sequence.id,
      sequencename: sequence.name,
      sequencecontent: sequence.content || 'Default Content', // Ensure content is provided
      recipients
    };

    this.http.post('http://192.168.0.232:8080/preformatted', requestData).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.snackbar.open('Contacts successfully assigned to sequence.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-success'],
        });
      },
      (error) => {
        console.error('API Error:', error);
        this.snackbar.open('Error assigning contacts to sequence. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar', 'snackbar-error'],
        });
      }
    );
  });
}


sendData(email: any) {
  // If an email is being edited, use the editable version
  const emailToSend = this.editingPreformattedIndex !== null
    ? this.editablePreformattedEmail // This is the edited email
    : email; // This is the unedited email

  // Prepare the request body with the selected email's details
  const requestBody = {
    id: emailToSend.id, // Ensure this exists or set a default value
    name: emailToSend.subject, // You can use subject or another property as name
    type: 'Pre-formatted Email', // You can adjust this if needed
    subject: emailToSend.subject,
    content: emailToSend.content,
  };

  // Send the email data to the backend
  this.http.post('http://192.168.0.232:8080/preformatted', requestBody).subscribe(
    (response) => {
      console.log('API Response:', response);
      this.snackbar.open('Email added to sequence successfully.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-success'],
      });
    },
    (error) => {
      console.error('API Error:', error);
      this.snackbar.open('Error adding email to sequence. Please try again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-error'],
      });
    }
  );
}


sendDataofai(email: any) {
  // If an email is being edited, use the editable version
  const emailToSend = this.aiGeneratedEmails !== null
    ? this.aiGeneratedEmails // This is the edited email
    : email; // This is the unedited email

  // Prepare the request body with the selected email's details
  const requestBody = {
    id: emailToSend.id, // Ensure this exists or set a default value
    ai_response: emailToSend.subject, // You can use subject or another property as name
    type: 'ai Email', // You can adjust this if needed
   
  };

  // Send the email data to the backend
  this.http.post('http://192.168.0.232:8080/api/chat', requestBody).subscribe(
    (response) => {
      console.log('API Response:', response);
      this.snackbar.open('Email added to sequence successfully.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-success'],
      });
    },
    (error) => {
      console.error('API Error:', error);
      this.snackbar.open('Error adding email to sequence. Please try again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'snackbar-error'],
      });
    }
  );
}









}
