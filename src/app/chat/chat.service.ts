import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { io } from "../../../node_modules/socket.io-client";
import { Observable } from "rxjs"


@Injectable({providedIn: "root"})
export class ChatService{

  private token : string;
  private socket = io('http://localhost:5000');

  constructor(private http : HttpClient, private router : Router){}

  newUser(name : string){
    this.socket.emit('new-user',name);
  }

  sendMessage(message: string){
    this.socket.emit('send-chat-message', message);
  }

  newMessageReceived() {
    const observable = new Observable<{ message: String}>(observer => {
      this.socket.on('chat-message', (data) => {
        observer.next(data);
        this.addReceivedMessage(data.message);

      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
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


}

