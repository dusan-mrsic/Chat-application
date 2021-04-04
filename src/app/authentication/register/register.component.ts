import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm) {
    const user : User = {name: form.value.name, lastName: form.value.lastName, username: form.value.username, password: form.value.password};
    this.http.post<{message: string}>("http://localhost:3000/register", user).subscribe();
    form.reset();
  }

}
