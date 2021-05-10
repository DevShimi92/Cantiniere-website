import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './shared/models/user.model';
import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DefaultService {

  private API_URL = environment.api_url;
  private user : User;

  constructor(private http: HttpClient) { 
    this.user = new User();
  }

  getToken (email:string,password:string) : Observable<any> {

    const headers = { 'Content-Type': 'application/json' };
    this.user.email = email;
    this.user.password = password;

    return this.http.post<any>(this.API_URL+'login',this.user,{ headers });
  }

  register(last_name:string, first_name:string, email:string, password:string):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' };
    this.user.last_name = last_name;
    this.user.first_name = first_name;
    this.user.email = email;
    this.user.password = password;

    return this.http.post<any>(this.API_URL+'user',this.user,{ headers });
  }

  getAllUser(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    
    return this.http.get(this.API_URL+'user', { headers }) ;
  }

  updateUser(id:number,last_name:string=null, first_name:string=null, email:string=null, password:string=null, money:number=null):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    this.user.id = id;
    this.user.last_name = last_name;
    this.user.first_name = first_name;
    this.user.email = email;
    this.user.money = money;
    this.user.password = password;

    return this.http.put<any>(this.API_URL+'user',this.user,{ headers });
  }

  postTypeOfArticle(name:string):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };

    return this.http.post<any>(this.API_URL+'type_article',{name : name},{ headers });
  }
  
  getAllTypeOfArticle(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' };

    return this.http.get(this.API_URL+'type_article', { headers }) ;
  }

  putTypeOfArticle(code_type:number, name:string):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json'  ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    const data = { code_type: code_type ,name : name }

    return this.http.put<any>(this.API_URL+'type_article',data,{ headers });
  }

  deleteTypeOfArticle(code_type:number):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json'  ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    const data = { code_type: code_type }

    return this.http.request<any>('delete',this.API_URL+'type_article',{ headers,body :data });
  }

  postArticle(name:string, price:number, code_type:number):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };

    const data = {
      name : name,
      price: price,
      code_type_src : code_type
    }
    return this.http.post<any>(this.API_URL+'article',data,{ headers });
  }

  getAllArticle(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' };

    return this.http.get(this.API_URL+'article', { headers }) ;
  }

  putArticle(id:number, name:string=null,price:number=null):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };

    const data = { id: id ,price : price ,name : name}

    return this.http.put<any>(this.API_URL+'article',data,{ headers });
  }

  deleteArticle(id:number):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    const data = { id: id }

    return this.http.request<any>('delete',this.API_URL+'article',{ headers,body :data });
  }

  postMenu(name:string): Observable<any>{

    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    
    return this.http.post<any>(this.API_URL+'menu',{name : name}, { headers }) ;
  }

  getAllMenu(): Observable<any>{

    const headers = { 'Content-Type': 'application/json' };
    
    return this.http.get<any>(this.API_URL+'menu', { headers }) ;
  }

  putMenu(id:number, name:string=null):Observable<any>{
    
    const headers = { 'Content-Type': 'application/json', 
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };

    const data = { 
      id: id ,
      name : name
    }

    return this.http.put<any>(this.API_URL+'menu',data,{ headers });
  }

  deleteMenu(id:number): Observable<any>{

    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    const data = { id: id }
    
    return this.http.request<any>('delete',this.API_URL+'menu',{ headers,body :data });
  }

  postMenuContent(idMenu:number,idArticle:number): Observable<any>{

    const headers = { 'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    const data = {
      id_menu : idMenu,
      id_article: idArticle,
    }
    
    return this.http.post<any>(this.API_URL+'menu/content',data, { headers }) ;
  }

  getMenuContent(idMenu:number): Observable<any>{

    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };
    
    return this.http.get<any>(this.API_URL+'menu/content/'+idMenu,{ headers }) ;
  }

  deleteMenuContent(idMenu:number, idArticle:number): Observable<any>{

    const headers = { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` };

    const data = {
      id_menu : idMenu,
      id_article: idArticle,
    }
    
    return this.http.request<any>('delete',this.API_URL+'menu/content/',{ headers,body :data });
  }

}