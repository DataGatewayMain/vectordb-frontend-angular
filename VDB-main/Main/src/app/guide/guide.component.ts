import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { driver } from 'driver.js';



interface Message {
  role: string;
  content: string;
  options?: string[];
}

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {
  
  
  messages: Message[] = [];
  userFirstName: string | null = '';
  userLastName: string | null = '';
  userMessage: string = '';
  chatbotOpen: boolean = false;
  currentSetIndex: number = 0;

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName');
    this.userLastName = localStorage.getItem('lastName');
    // this.addBotMessage("Messages");
  }

  tourGuide() {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous'],
      steps: [
        { element: '.allFilters', popover: { title: 'Apply Filters', description: 'Use Filters to build a targeted list of the best prospects.', side: "left", align: 'start' }},
        { element: '.components', popover: { title: 'Saved Contacts', description: `Use the Saved tab to take actions on contacts that you've already saved, and the Net New tab to find people that you have not added yet.`, side: "bottom", align: 'start' }},
        { element: '.peopleCompaniesSavedList', popover: { title: 'Save your Progress', description: 'Organize your contacts by saving them to lists.', side: "bottom", align: 'start' }},
        { element: '.searchSavedSearches', popover: { title: 'Save your searches', description: 'Save time searching for new contacts with Saved Searches', side: "left", align: 'start' }},
      ]
    });
    driverObj.drive();
  }

  closeUserDialog() {
    this.dialog.closeAll();
  }

  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
    if (this.chatbotOpen) {
      
      this.getInitialQuestions();
    }
  }

  getInitialQuestions() {
    this.http.get<any>('https://chat-bot-3-8alb.onrender.com/questions').subscribe(
      response => {
        this.addBotMessage("Welcome", response.questions);
      },
      error => {
        console.error('Error fetching initial questions:', error);
      }
    );
  }

  // sendMessage() {
  //   const message = this.userMessage.trim();
  //   if (message === '') return;

  //   this.messages.push({ role: 'user', content: message });
  //   this.userMessage = '';

  //   this.http.post<any>('http://localhost:3000/chat', { message, currentSetIndex: this.currentSetIndex }).subscribe(
  //     response => {
  //       this.messages.push({ role: 'bot', content: response.reply });
  //       if (response.nextQuestions) {
  //         this.addBotMessage("Please choose one of the following questions:", response.nextQuestions);
  //         this.currentSetIndex++;
  //       }
  //     },
  //     error => {
  //       console.error('Error:', error);
  //       this.messages.push({ role: 'bot', content: 'Error occurred while processing your request.' });
  //     }
  //   );
  // }

  addBotMessage(content: string, options?: string[]) {
    this.messages.push({ role: 'Alisha', content, options });
  }

  // selectOption(option: string) {
  //   this.userMessage = option;
  //   this.sendMessage();
  // }



  userMessageVisible: boolean = true; // To control the visibility of user input

  selectOption(selectedOption: string) {
    // Hide user input and send button
    this.userMessageVisible = false;

    // Remove unselected options from the messages array
    this.messages = this.messages.filter(message => {
      if (message.role === 'Alisha' && message.options) {
        return message.options.includes(selectedOption);
      }
      return true;
    });

    // Send the selected option to the backend
    this.sendMessage(selectedOption);
  }

  // Function to send message to backend
  sendMessage(message?: string) {
    const userMessage = message || this.userMessage.trim();
    if (userMessage === '') return;

    // Add user message to messages array
    this.messages.push({ role: 'user', content: userMessage });

    // Send message to backend
    this.http.post<any>('https://chat-bot-3-8alb.onrender.com/chat', { message: userMessage }).subscribe(
      response => {
        // Add bot reply to messages array
        this.messages.push({ role: 'Alisha', content: response.reply, options: response.nextQuestions });

        // Show user input and send button if there are no next questions
        this.userMessageVisible = !response.nextQuestions || response.nextQuestions.length === 0;
      },
      error => {
        console.error('Error:', error);
        this.messages.push({ role: 'Alisha', content: 'Error occurred while processing your request.' });
      }
    );
  }
}