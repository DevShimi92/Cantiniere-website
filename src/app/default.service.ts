import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './shared/models/user.model';

export class SessionUser {
  constructor(
      public token: string, 
  )
  {
      this.token = token ;
  }
}


@Injectable({
    providedIn: 'root'
  })
export class DefaultService {

  private API_URL = 'https://cantiniere-api.herokuapp.com/';
  private user : User;

  constructor(private http: HttpClient) { 
    this.user = new User();
  }

  getToken (email:string,password:string) : Observable<SessionUser> {

    const headers = { 'Content-Type': 'application/json' };
    this.user.email = email;
    this.user.password = password;

    return this.http.post<SessionUser>(this.API_URL+'login',this.user,{ headers });
  }


}