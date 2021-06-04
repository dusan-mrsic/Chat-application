import { Message } from '../../../../backend/models/message'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ChatService } from '../chat.service'
import { Subscription } from 'rxjs';
import * as NodeRSA from 'node-rsa';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css'],
  providers: [ ChatService ]

})
export class ChatScreenComponent implements OnInit, OnDestroy {

  private messages : Message[] = [];
  myUsername : String;
  myPassword : String;
  onlineUsers : Array<String> = [];
  selectedUser : String;
  subvar1: Subscription; subvar2: Subscription; subvar3: Subscription; subvar4 : Subscription;
  key : any;



  constructor(private chatService : ChatService, private authService : AuthenticationService) {
    this.subvar1 = this.chatService.newMessageReceived().subscribe(data => {
      this.messages.push(data.message);
      console.log(data.message);
      console.log(data.username, this.selectedUser);
      if(data.username === this.selectedUser) this.addReceivedMessage(String(data.message));
   })
    this.subvar2 = this.chatService.newUserConnected().subscribe(data =>{
      this.onlineUsers = data;
      //console.log(data);
    })
    this.subvar3 = this.chatService.userDisconnected().subscribe(data =>{
      this.onlineUsers = data;
    })
    this.subvar4 = this.chatService.receiveMessages().subscribe(data =>{
      this.messages = data;
      this.messages.forEach((mess) => {
        if(mess.fromUser == this.myUsername){
          this.addSentMessage(mess.message);
        }else{
          this.addReceivedMessage(mess.message);
        }
      })
      this.scrollToEnd();
    })

  }
  ngOnDestroy() : void{
    if(this.subvar1.closed) this.subvar1.unsubscribe();
    if(this.subvar2.closed) this.subvar1.unsubscribe();
    if(this.subvar3.closed) this.subvar1.unsubscribe();
    if(this.subvar4.closed) this.subvar1.unsubscribe();
  }

  ngOnInit(): void {
    this.myPassword = this.authService.getLastLoggedPassword();
    this.chatService.newUser(this.authService.getLastLoggeduserName());
    this.myUsername = this.authService.getLastLoggeduserName();
    this.chatService.sendLoginMessageToAS(this.myUsername, this.myPassword);
    this.chatService.sendLoginMessageToTGS(this.myUsername, this.myPassword);
  }

  onSend(form: NgForm){
    this.chatService.sendMessage(form.value.message, this.selectedUser, this.myUsername);
    this.addSentMessage(form.value.message);
    this.scrollToEnd();
    form.reset();
  }

  onLogout(){
    this.authService.logout();
    this.chatService.logout(this.myUsername);
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

  addReceivedMessage(message: string){
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = 'white';
    element.style.border = '0.1px solid';
    element.style.borderRadius = '24px 24px 24px 0px'
    element.style.padding =  '15px 30px';
    element.style.left = '120px';
    element.style.marginTop = '10px';
    element.style.marginBottom = '10px';
    element.style.listStyleType = 'none';
    element.style.width = '400px';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    document.getElementById('message-list').appendChild(element);
  }

  scrollToEnd(){
    var chatList = document.getElementById("message-list");
    chatList.scrollTop = chatList.scrollHeight;
  }

  onSelectedUserChange(selectedUser: String){
    //console.log("select user");
    const myNode = document.getElementById("message-list");
    while(myNode.firstChild){
      myNode.removeChild(myNode.lastChild);
    }
    this.selectedUser = selectedUser;
    //console.log(this.selectedUser);
    this.loadMessages();
    this.scrollToEnd();
  }

  loadMessages(){
    this.chatService.requestMessages(this.myUsername, this.selectedUser);
    //console.log("once or twice");
  }



}
