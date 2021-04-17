import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "./user.model";
import { LoginModel } from "./login.model";

@Injectable({providedIn: "root"})
export class AuthenticationService{

  private token : string;
  private lastLoggedUsername : string;

  constructor(private http : HttpClient, private router : Router){}

  register(name: string, lastName: string, username: string, password: string){
    const user : User = {name : name, lastName : lastName, username : username, password : password};
    this.http.post<{message: string}>("http://localhost:3000/register", user).subscribe();
  }

  login(username: string, password: string){
    const user : LoginModel = {username: username, password: password};
    this.http.post<{token: string}>("http://localhost:3000/login", user).subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token){
        this.lastLoggedUsername = username;
        this.router.navigate(["/chat"]);
      }
    });
  }

  getLastLoggeduserName(){
    return this.lastLoggedUsername;
  }

  getToken(){
    console.log(this.token);
    return this.token;
  }

}
