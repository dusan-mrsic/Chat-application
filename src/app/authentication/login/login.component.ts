import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private users : User[] = [];

  constructor(private http: HttpClient, private autheticationService: AuthenticationService) {}

  ngOnInit(): void {
  }

  onLogin(form: NgForm){
    this.autheticationService.login(form.value.username, form.value.password);
  }

}
