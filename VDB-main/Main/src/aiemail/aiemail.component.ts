import { Component } from '@angular/core';
import { GetDataService } from 'src/app/mainpage/sidenavfolders/search/people/get-data.service';

@Component({
  selector: 'app-aiemail',
  templateUrl: './aiemail.component.html',
  styleUrl: './aiemail.component.css'
})
export class AiemailComponent {
  constructor( private service:GetDataService){

  }
  sequenceTitle = "Data's Outbound AI Sequence 3";
  steps = [
    { day: 1, name: 'Outreach', type: 'Automatic email', content: '', expanded: false },
    { day: 4, name: 'Follow-up', type: 'Automatic email', content: '', expanded: false },
    { day: 7, name: 'Last pitch', type: 'Automatic email', content: '', expanded: false },
  ];
  totalDays = 7;

  toggleDetails(index: number): void {
    this.steps[index].expanded = !this.steps[index].expanded;
  }

  editInformation(): void {
    alert('Editing information...');
  }

  saveSequence(): void {
    alert('Sequence saved successfully!');
  }
  generateAIEmail(prompt: string, day: number, stepName: string): void {
    this.service.generateEmail(prompt).subscribe((response) => {
      this.steps.push({
        day: day,
        name: stepName,
        type: 'Automatic email',
        content: response.text,
        expanded: false,
      });
    });
  }
  
}
