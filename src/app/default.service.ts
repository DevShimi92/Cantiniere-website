import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { User } from './shared/models/user.model';
import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DefaultService {


  private emitChangeSource = new Subject<any>();

    changeEmitted$ = this.emitChangeSource.asObservable();
    
    emitChange() {
        this.emitChangeSource.next();
    }
    
  private API_URL = environment.api_url;
  private user : User;

  constructor(private http: HttpClient) { 
    this.user = new User();
  }


  postMenu(name:string): Observable<any>{
    
    return this.http.post<any>(this.API_URL+'menu',{name : name}) ;
  }

  getAllMenu(): Observable<any>{

    
    return this.http.get<any>(this.API_URL+'menu') ;
  }

  putMenu(id:number, name:string=null):Observable<any>{
 
    const data = { 
      id: id ,
      name : name
    }

    return this.http.put<any>(this.API_URL+'menu',data);
  }

  deleteMenu(id:number): Observable<any>{

    const data = { id: id }
    
    return this.http.request<any>('delete',this.API_URL+'menu',{ body :data });
  }

  postMenuContent(idMenu:number,idArticle:number): Observable<any>{

    const data = {
      id_menu : idMenu,
      id_article: idArticle,
    }
    
    return this.http.post<any>(this.API_URL+'menu/content',data) ;
  }

  getMenuContent(idMenu:number): Observable<any>{
    
    return this.http.get<any>(this.API_URL+'menu/content/'+idMenu) ;
  }

  deleteMenuContent(idMenu:number, idArticle:number): Observable<any>{

    const data = {
      id_menu : idMenu,
      id_article: idArticle,
    }
    
    return this.http.request<any>('delete',this.API_URL+'menu/content/');
  }

}