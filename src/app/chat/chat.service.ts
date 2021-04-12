import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { io } from "../../../node_modules/socket.io-client";
import { Observable } from "rxjs"


@Injectable({providedIn: "root"})
export class ChatService{

  private token : string;
  private socket = io('http://localhost:5000/');

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
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}

