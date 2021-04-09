import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user.model';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private autheticationService : AuthenticationService) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm) {
    if(form.value.password === form.value.confirmPassword){
      this.autheticationService.register(form.value.name,form.value.lastName,form.value.username,form.value.password);
      form.reset();
    }else{
      console.log("Passwords does not match!");
    }
  }

}
