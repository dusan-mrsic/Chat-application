declare function require(name:string);

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { io } from "../../../node_modules/socket.io-client";
import { Observable } from "rxjs"
import { Message } from '../../../backend/models/message';
import { MessageToAS } from "./messageToAS.model";

var keypair = require('keypair');


//import {config} from 'app.config";
import {Buffer} from 'buffer/';
import * as crypto from "crypto-browserify";





@Injectable()
export class ChatService{

  private token : string;
  private socket = io('http://localhost:5000');
  onlineUsers : Array<string> = [];
  messages : Message[] = [];
  plaintext: string = "secret";
  rsakey;
  encrypt;
  decrypt;
  sessionKeyTGS;
  messageFromAStoTGS;


  constructor(private http : HttpClient, private router : Router){
    console.log("KREIRAN SERVICE");
    this.rsakey = keypair();
    // ENCRYPTION
    // let buffer = new Buffer(this.plaintext);
    // console.log(buffer);
    // let encrypted = crypto.privateEncrypt(this.rsakey.private, buffer);
    // //encrypted = encrypted.toString('base64');
    // console.log(encrypted);
    // let buffer1 = Buffer.from(encrypted);
    // console.log(buffer1);
    // let plaintext1 = crypto.publicDecrypt(this.rsakey.public, buffer1);

    // console.log(plaintext1.toString('utf8'));


    //KRIPTUJ PRIVATNIM - DEKRIPTUJ JAVNIM

  }

  newUser(name : string){
    this.socket.emit('new-user', name);
  }

  sendMessage(message: String, username: String, fromUsername : String){
    this.socket.emit('send-chat-message', message, username, fromUsername);
  }

  sendLoginMessageToAS(username: String, password : String){
    // SEND PRIVATE KEY TO SERVER TO CRYPT WITH IT, AND DECRYPT WITH MY PUBLIC
    const messageAS : MessageToAS = {username: username, privateKey: this.rsakey.private};
    this.http.post<{publicSessionKey: string, messageForTGS: string}>("http://localhost:8000/loginMessageToAS", messageAS).subscribe(response => {
      let buffer1 = Buffer.from(response.publicSessionKey, 'base64');
      this.sessionKeyTGS = crypto.publicDecrypt(this.rsakey.public, buffer1);
      this.messageFromAStoTGS = response.messageForTGS;
      console.log((this.messageFromAStoTGS));
      console.log(this.sessionKeyTGS.toString('utf8'));
    });
  }

  newUserConnected(){
    const observable = new Observable<String[]>(observer => {
      this.socket.on('user-connected', (data) => {
        this.onlineUsers = data;
        observer.next(this.onlineUsers);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  newMessageReceived() {
    const observable = new Observable<{ message: String, username: String}>(observer => {
      this.socket.on('chat-message', (data) => {
       console.log(data.username);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  logout(username: String){
    this.socket.emit("disconnect-force", username);
  }

  userDisconnected(){

    const observable = new Observable<String[]>(observer => {
      this.socket.on('user-disconnected', (data) => {
        this.onlineUsers = data;
        observer.next(this.onlineUsers);
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

  requestMessages(toUsername: String, fromUsername: String){
    this.socket.emit('request-messages', toUsername, fromUsername);
  }

  receiveMessages(){
    const observable = new Observable<Message[]>(observer => {
      this.socket.on('receive-messages', (data) => {
        this.messages = data;
        observer.next(this.messages);
        console.log(this.messages);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}

