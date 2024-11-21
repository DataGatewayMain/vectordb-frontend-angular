import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  messages: { text: string, type: string }[] = [];
  userMessage: string = '';
  showInput: boolean = false;
  currentOptions: any[] = [];
  askEiraClicked: boolean = false;

  options = [
    { text: 'Ask EIRA', response: 'Hi, I\'m EIRA from vectorDB 🙋‍♀️\nI\'m an AI bot and I\'d love to try helping out with any questions you may have.\nFeel free to ask me anything!' },
  ];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
 
    this.messages = [];
    this.currentOptions = this.options;
  }

  selectOption(option: any) {
    if (option.text === 'Ask EIRA') {
      this.messages.push({ text: option.text, type: 'question' });
      this.messages.push({ type: 'input', text: '' });
    } else {
      this.displayResponse(option);
    }
  }

  handleUserInput() {
    if (this.userMessage.trim() !== '') {
      if (this.currentOptions.length > 0) {
        // User has selected an option
        const selectedOption = this.currentOptions.find(option => option.text === this.userMessage);
        if (selectedOption) {
          this.messages.push({ text: selectedOption.text, type: 'question' });
          this.messages.push({ type: 'input', text: '' });
        } else {
          // Display response based on user input
          const response = this.getResponse(this.userMessage);
          this.displayResponse(response);
          this.userMessage = '';
        }
        this.currentOptions = [];
      } else {
        // Input box is already open
        this.messages.push({ text: this.userMessage, type: 'question' });
        const response = this.getResponse(this.userMessage);
        this.displayResponse(response);
        this.userMessage = '';
      }
    }
  }

  displayResponse(response: string) {
    this.messages.push({ text: response, type: 'answer' });
  }

  getResponse(message: string): string {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('api/docs')) {
      return 'Ready to take your prospecting experience to the next level? <a href="https://knowledge.vectordb.app">Read documents</a>?';
    } else if (lowerCaseMessage.includes('extension')) {
      return 'Extension: Here is the information about the Extension...';
    } else if (lowerCaseMessage.includes('advanced filters')) {
      return 'Advanced Filters: Here is the information about Advanced Filters...';
    } 
    else {
      return 'Sorry, I couldn\'t find a relevant response for that input.';
    }
  }

  openChat() {
    this.messages = [];
    this.currentOptions = this.options;
    this.showInput = true; // Set showInput to true to display the input box
    this.askEiraClicked = true; // Set askEiraClicked to true when "Ask EIRA" is clicked
    // Display initial message and input box
    this.messages.push({ text: 'Hey there 😊 Please let us know how we can assist you today', type: 'answer' });
    this.messages.push({ text: 'Ask EIRA', type: 'question' });
    this.messages.push({ type: 'input', text: '' });
  }
  
  


}
