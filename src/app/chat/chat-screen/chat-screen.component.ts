import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ChatService } from '../chat.service'

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {

  private messages : Array<String> = [];
  myUsername : String;
  onlineUsers : Array<String> = [];

  constructor(private chatService : ChatService, private authService : AuthenticationService) {
    this.chatService.newMessageReceived().subscribe(data => {
      this.messages.push(data.message);
      console.log(data.message);
   })
    this.chatService.newUserConnected().subscribe(data =>{
      this.onlineUsers = data;
    })


  }

  ngOnInit(): void {
    this.chatService.newUser(this.authService.getLastLoggeduserName());
    this.myUsername = this.authService.getLastLoggeduserName();
  }

  onSend(form: NgForm){
    this.chatService.sendMessage(form.value.message, "Dragana07");
    this.addSentMessage(form.value.message);
    this.scrollToEnd();
    this.scrollToEnd();
    form.reset();
  }

  addSentMessage(message : string){
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = '#3f51b5';
    element.style.padding =  '15px 30px';
    element.style.border = '1px solid';
    element.style.borderRadius = '24px 24px 0px 24px';
    element.style.marginLeft = '550px';
    element.style.marginTop = '10px';
    element.style.marginBottom = '15px';
    element.style.textAlign = 'right';
    element.style.listStyleType = 'none';
    element.style.width = '400px';
    element.style.overflow = 'visible';
    element.style.textOverflow = 'ellipsis';
    document.getElementById('message-list').appendChild(element);
  }

  scrollToEnd(){
    var chatList = document.getElementById("message-list");
    chatList.scrollTop = chatList.scrollHeight;
  }

}
