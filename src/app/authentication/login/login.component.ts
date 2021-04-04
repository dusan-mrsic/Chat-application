import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private users : User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  onLogin(form: NgForm){
    this.http.get<{users: User[]}>("http://localhost:3000/api/login").subscribe((userData) => {
      console.log("success");
      this.users = userData.users;
      for(let user of this.users){
        if(user.username === form.value.username){
          if(user.password === form.value.password){
            console.log("Successfull login!");
          }else{
            console.log("Invalid password!");
          }
        }else{
          console.log("User not found!");
        }
      }
    });

  }

}
