import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  getToken (email:string,password:string) : Observable<SessionUser> {

    const headers = { 'Content-Type': 'application/json' };
    const body  = { email : email, password : password};

    return this.http.post<SessionUser>(this.API_URL+'login',body,{ headers });
  }


}