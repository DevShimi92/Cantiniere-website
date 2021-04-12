import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './shared/models/user.model';
import { environment } from './../environments/environment';


export class SessionUser {
  constructor(
      public token: string 
  )
  {
      this.token = token ;
  }
}

export class test {
  constructor(
    public code_type: string,
    public name: string
  )
  {
    this.code_type = code_type;
    this.name = name;
  }
}


@Injectable({
    providedIn: 'root'
  })
export class DefaultService {

  private API_URL = environment.api_url;
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

  register(last_name:string, first_name:string, email:string, password:string):Observable<SessionUser>{
    
    const headers = { 'Content-Type': 'application/json' };
    this.user.last_name = last_name;
    this.user.first_name = first_name;
    this.user.email = email;
    this.user.password = password;

    return this.http.post<SessionUser>(this.API_URL+'user',this.user,{ headers });
  }

  updateUser(id:number,last_name:string=null, first_name:string=null, email:string=null, password:string=null):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' };
    this.user.id = id;
    this.user.last_name = last_name;
    this.user.first_name = first_name;
    this.user.email = email;
    this.user.password = password;

    return this.http.put<SessionUser>(this.API_URL+'user',this.user,{ headers });
  }

  getAllTypeOfArticle(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' };

    return this.http.get(this.API_URL+'type_article', { headers }) ;
  }

  getAllArticle(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' };

    return this.http.get(this.API_URL+'article', { headers }) ;
  }
}