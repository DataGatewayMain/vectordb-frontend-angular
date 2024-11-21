import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { EmailselectionComponent } from 'src/emailselection/emailselection.component';
import { MatDialog } from '@angular/material/dialog';
interface Sender {
  first_name: string;
  last_name: string;
  username: string;
  host?: string;
  password?: string;
}
interface SequenceStep {
  type: string; // 'AI-Generated Email' or 'Preformatted Email'
  day: number;
  subject: string;
  content: string;
}
interface EmailOption {
  subject: string;
  content: string;
}



interface Step {
  day: number;
  action: string;
  generatedOptions: EmailOption[];
  selectedOption: EmailOption | null;
  selectedTemplate?: EmailOption | null; // Optional property for pre-formatted template
}
@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrl: './sequence.component.css'
})
export class SequenceComponent {
  jobTitle: string = '';
  companyName: string = '';
  personName: string = '';
  emailType: string = 'Introduction'; // Default email type
  sequenceSteps: SequenceStep[] = []; // Use the SequenceStep interface
  // aiGeneratedEmails: EmailOption[] = [];
  // preformattedEmails: EmailOption[] = [];
  // selectedTemplate: EmailOption | null = null;
  // selectedTemplate: any = null;
  constructor(private emailService: GetDataService,private dialog:MatDialog) {}

  ngOnInit(): void {
    this.loadPreformattedEmails();
    console.log(this.sequenceSteps,'sequencesteps');
    

    // Sample data for templates
    
  }

  // Load preformatted email templates
  loadPreformattedEmails(): void {
    this.emailService.getPreformattedEmails().subscribe(
      (response) => {
        this.preformattedEmails = response;
        console.log(response,'this si the response of stored emails');
        
      },
      (error) => console.error('Error loading preformatted emails:', error)
    );
  }

  // Set email type (Introduction, Follow-Up, Last Attempt)
  setEmailType(type: string): void {
    this.emailType = type;
    this.generateAIGeneratedEmails(); // Automatically fetch emails for the selected type
  }
  

  // Generate AI-generated emails
generateAIGeneratedEmails(): void {
  this.emailService.generateAIGeneratedEmails(this.jobTitle, this.companyName, this.personName, this.emailType).subscribe(
    (response: { generatedEmails: any[] }) => {
      this.aiGeneratedEmails = response.generatedEmails;
    },
    (error: any) => console.error('Error generating AI emails:', error)
  );
}


  // Select a template (either AI-generated or preformatted)
  selectTemplate(template: EmailOption): void {
    this.selectedTemplate = template;
  }


  selectedTemplate: any = {
    name: 'The Quick Pitch Cold Calling Script',
    description: 'A concise script for pitching cold calls effectively.',
    steps: [
      {
        type: 'Manual email',
        day: 1,
        icon: '✉️',
        content: 'Write a highly personalized email.',
      },
      {
        type: 'Phone call',
        day: 1,
        icon: '📞',
        content:
          "Call script: Hey {{first_name}}, it's [YOUR NAME] from [YOUR COMPANY].",
      },
    ],


  


  

  

 

  // Select a template
  // selectTemplate(template: any): void {
  //   this.selectedTemplate = template;
  // }

  // Preview a specific step
  previewStep(step: any): void {
    alert(`Previewing: ${step.type} (Day ${step.day})`);
  }
}

  // sequenceSteps = [
  //   {
  //     type: 'Manual email',
  //     day: 1,
  //     icon: '✉️',
  //     subject: 'Welcome Email',
  //     content: 'Hello {{name}}, welcome to our service!',
  //   },
  // ];

  // AI-generated email options
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

  // Preformatted email templates
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

  // // Add selected template to sequence
  // addToSequence(template: any, source: string): void {
  //   const newStep = {
  //     type: source === 'AI' ? 'AI-Generated Email' : 'Preformatted Email',
  //     day: this.sequenceSteps.length + 1,
  //     icon: '✉️',
  //     subject: template.subject,
  //     content: template.content,
  //   };
  //   this.sequenceSteps.push(newStep);
  // }



 // Store selected email templates

 

 openDialog(): void {
  const dialogRef = this.dialog.open(EmailselectionComponent, {
    width: '600px',
    data: { sequenceSteps: this.sequenceSteps },
  });

  dialogRef.afterClosed().subscribe((result: SequenceStep) => {
    if (result) {
      this.sequenceSteps.push(result); // Push the correctly typed step
    }
  });
}



}