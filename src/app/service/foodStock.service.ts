import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TypeArticle } from '../shared/models/typeArticle.model';
import { Article } from '../shared/models/article.model';
import { Menu } from '../shared/models/menu.model';
import { MenuContent } from '../shared/models/menuContent.model';

class Hourlimit {
    hour_limit: string;
  }

class IdMenu {
    id: number;
  }

@Injectable({
    providedIn: 'root'
  })


export class FoodStockService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient) { }

    postTypeOfArticle(name:string):Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<void>(this.API_URL+'type_article',{name : name}).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    getAllTypeOfArticle(): Observable<TypeArticle[]>{

        return this.http.get<TypeArticle[]>(this.API_URL+'type_article') ;
    }

    putTypeOfArticle(code_type:number, name:string):Promise<boolean>{
    
        const data = { code_type: code_type ,name : name };

        return new Promise<boolean>((resolve, reject) => {

            this.http.put<void>(this.API_URL+'type_article',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    }

    deleteTypeOfArticle(code_type:number):Promise<boolean>{
    
        const data = { code_type: code_type };

        return new Promise<boolean>((resolve, reject) => {

            this.http.request<void>('delete',this.API_URL+'type_article',{body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    
        
    
    }

    postArticle(name:string, price:number, code_type:number,description:string=null,picture:File=null):Promise<boolean>{

        const formData: FormData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('code_type_src', code_type.toString());
        formData.append('description',description);
        if(picture)
            formData.append('img', picture, picture.name);

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<void>(this.API_URL+'article',formData).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });

        
    
    }

    getAllArticle(): Observable<Article[]>{

         return this.http.get<Article[]>(this.API_URL+'article') ;
      
    }

    putArticle(id:number, name:string=null,price:number=null,description:string=null):Promise<boolean>{

        const data = { 
            id: id,
            price: price,
            name: name, 
            description: description
        };

        return new Promise<boolean>((resolve, reject) => {
    
            this.http.put<void>(this.API_URL+'article',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });

        });
    }

    putImageArticle(id:number, picture:File):Promise<boolean>{

        const formData: FormData = new FormData();
        formData.append('id_article', id.toString());
        formData.append('img', picture, picture.name);

        return new Promise<boolean>((resolve, reject) => {
    
            this.http.put<void>(this.API_URL+'image',formData).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });

        });
    }

    deleteArticle(id:number):Promise<boolean>{
    
        const data = { id: id };

        return new Promise<boolean>((resolve, reject) => {
        
            this.http.request<void>('delete',this.API_URL+'article',{ body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });
        });
    
        
    }
    
    postMenu(name:string,price_final=0,description:string=null,picture:File=null): Promise<number>{

        const formData: FormData = new FormData();
        formData.append('name', name);
        formData.append('price_final', price_final.toString());
        formData.append('description',description);
        if(picture)
            formData.append('img', picture, picture.name);
        
        return new Promise<number>((resolve, reject) => {

            this.http.post<IdMenu>(this.API_URL+'menu',formData).toPromise().then((response) => {
                return resolve(response.id);
            }).catch((error) => {
                return reject(error);
            });
        });
    
    }

    getAllMenu(): Observable<Menu[]>{

        return this.http.get<Menu[]>(this.API_URL+'menu') ;
    
    }

    putMenu(id:number, name:string=null,price_final=0,description:string=null):Promise<boolean>{
 
        const data = { 
          id: id ,
          name : name,
          price_final : price_final,
          description :description
      };

        return new Promise<boolean>((resolve, reject) => {

            this.http.put<void>(this.API_URL+'menu',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
    
    }

    putImageMenu(id:number, picture:File):Promise<boolean>{

        const formData: FormData = new FormData();
        formData.append('id_menu', id.toString());
        formData.append('img', picture, picture.name);

        return new Promise<boolean>((resolve, reject) => {
    
            this.http.put<void>(this.API_URL+'image',formData).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });

        });
    }

    deleteMenu(id:number):Promise<boolean>{

        const data = { id: id };

        return new Promise<boolean>((resolve, reject) => {

            this.http.request<void>('delete',this.API_URL+'menu',{ body :data }).toPromise().then( () => {
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

            this.http.post<void>(this.API_URL+'menu/content',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        });
        
    }

    getMenuContent(idMenu:number): Observable<MenuContent[]>{
    
        return this.http.get<MenuContent[]>(this.API_URL+'menu/content/'+idMenu) ;
      
    }

    deleteMenuContent(idMenu:number, idArticle:number): Promise<boolean>{

        const data = {
          id_menu : idMenu,
          id_article: idArticle,
        }

        return new Promise<boolean>((resolve, reject) => {
        
            this.http.request<void>('delete',this.API_URL+'menu/content/',{ body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });
        
        });
    }
    
    getHourLimit(): Observable<Hourlimit>{
    
        return this.http.get<Hourlimit>(this.API_URL+'setting/hour_limit/') ;
      
    }
}