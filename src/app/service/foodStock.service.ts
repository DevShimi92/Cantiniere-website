import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })


export class FoodStockService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient) { }

    postTypeOfArticle(name:string):Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'type_article',{name : name}).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    getAllTypeOfArticle(): Observable<any>{

        return this.http.get(this.API_URL+'type_article') ;
    }

    putTypeOfArticle(code_type:number, name:string):Promise<boolean>{
    
        const data = { code_type: code_type ,name : name };

        return new Promise<boolean>((resolve, reject) => {

            this.http.put<any>(this.API_URL+'type_article',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    }

    deleteTypeOfArticle(code_type:number):Promise<boolean>{
    
        const data = { code_type: code_type };

        return new Promise<boolean>((resolve, reject) => {

            this.http.request<any>('delete',this.API_URL+'type_article',{body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    
        
    
    }

    
}