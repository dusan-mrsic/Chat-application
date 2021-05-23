import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "./user.model";
import { LoginModel } from "./login.model";

@Injectable({providedIn: "root"})
export class AuthenticationService{

  private token : string;
  private lastLoggedUsername : string;
  private lastLoggedPassword : string;

  constructor(private http : HttpClient, private router : Router){
    //console.log("auth service cerated");
  }

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
        this.lastLoggedPassword = password;
        this.router.navigate(["/chat"]);
      }
    });
  }

  logout() {
    this.token = null;
    this.router.navigate(["/"]);
  }

  getLastLoggeduserName(){
    return this.lastLoggedUsername;
  }

  getLastLoggedPassword(){
    return this.lastLoggedPassword;
  }

  getToken(){
    //console.log(this.token);
    return this.token;
  }

}
