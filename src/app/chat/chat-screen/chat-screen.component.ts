import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from '../chat.service'

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {

  private messages : String[];

  constructor(private chatService : ChatService) {
    this.chatService.newMessageReceived().subscribe(data => {
      this.messages.push(data.message);
      console.log(data.message);
   })
  }

  ngOnInit(): void {
    this.chatService.newUser("Dusan");
  }

  onSend(form: NgForm){
    this.chatService.sendMessage(form.value.message);
  }

}
