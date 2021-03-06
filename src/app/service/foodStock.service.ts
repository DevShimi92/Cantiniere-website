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

    postArticle(name:string, price:number, code_type:number):Promise<boolean>{

        const data = {
          name : name,
          price: price,
          code_type_src : code_type
        }

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'article',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });

        
    
    }

    getAllArticle(): Observable<any>{

         return this.http.get(this.API_URL+'article') ;
      
    }

    putArticle(id:number, name:string=null,price:number=null):Promise<boolean>{

        const data = { id: id ,price : price ,name : name};

        return new Promise<boolean>((resolve, reject) => {
    
            this.http.put<any>(this.API_URL+'article',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });

        });
    }

    deleteArticle(id:number):Promise<boolean>{
    
        const data = { id: id };

        return new Promise<boolean>((resolve, reject) => {
        
            this.http.request<any>('delete',this.API_URL+'article',{ body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });
        });
    
        
    }
    
    postMenu(name:string,price_final=0,description:string=null): Promise<number>{

        const data = {
            name : name,
            price_final : price_final,
            description :description
        };

        return new Promise<number>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'menu',data).toPromise().then((response) => {
                return resolve(response.id);
            }).catch((error) => {
                return reject(error);
            });
        });
    
    }

    getAllMenu(): Observable<any>{

        return this.http.get<any>(this.API_URL+'menu') ;
    
    }

    putMenu(id:number, name:string=null,price_final=0,description:string=null):Promise<boolean>{
 
        const data = { 
          id: id ,
          name : name,
          price_final : price_final,
          description :description
      };

        return new Promise<boolean>((resolve, reject) => {

            this.http.put<any>(this.API_URL+'menu',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
    
    }

    deleteMenu(id:number):Promise<boolean>{

        const data = { id: id };

        return new Promise<boolean>((resolve, reject) => {

            this.http.request<any>('delete',this.API_URL+'menu',{ body :data }).toPromise().then( () => {
                    return resolve(true);
                }).catch((error) => {
                    return reject(error);
                });
        });
    }

    postMenuContent(idMenu:number,idArticle:number): Promise<boolean>{

        const data = {
          id_menu : idMenu,
          id_article: idArticle,
        }

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'menu/content',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
        
    }

    getMenuContent(idMenu:number): Observable<any>{
    
        return this.http.get<any>(this.API_URL+'menu/content/'+idMenu) ;
      
    }

    deleteMenuContent(idMenu:number, idArticle:number): Promise<boolean>{

        const data = {
          id_menu : idMenu,
          id_article: idArticle,
        }

        return new Promise<boolean>((resolve, reject) => {
        
            this.http.request<any>('delete',this.API_URL+'menu/content/',{ body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        
        });
    }
    
}