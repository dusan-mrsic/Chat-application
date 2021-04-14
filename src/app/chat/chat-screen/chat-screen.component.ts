import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from '../chat.service'

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {

  private messages : Array<String> = [];

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
    this.addSentMessage(form.value.message);
    this.scrollToEnd();
    form.reset();

  }

  addSentMessage(message : string){
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = '#3f51b5';
    element.style.padding =  '15px 30px';
    element.style.border = '1px solid';
    element.style.borderRadius = '24px 24px 0px 24px'
    element.style.marginLeft = '550px';
    element.style.marginTop = '10px';
    element.style.marginBottom = '15px';
    element.style.textAlign = 'right';
    element.style.listStyleType = 'none';
    element.style.width = '400px';
    element.style.height = '15px';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    document.getElementById('message-list').appendChild(element);
  }

  scrollToEnd(){
    var chatList = document.getElementById("message-list");
    chatList.scrollTop = chatList.scrollHeight;
  }

}
