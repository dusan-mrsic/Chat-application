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
    const user : User = {name: null, lastName: null, username: form.value.username, password: form.value.password};
    this.http.post<{message: string}>("http://localhost:3000/login", user).subscribe(response => {
      console.log(response);
    });
  }

}
