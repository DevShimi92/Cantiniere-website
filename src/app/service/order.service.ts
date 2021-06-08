import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
  })

export class OrderService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient) { }

    postOrderInfo(idClient:number,soldBeforeOrder:number,total:number):Promise<number>{

        const data = {
          id_client : idClient,
          sold_before_order : soldBeforeOrder,
          total : total 
        };

        return new Promise<number>((resolve, reject) => { 

            this.http.post<any>(this.API_URL+'order',data).toPromise().then((response) => {
                return resolve(response.id);
            }).catch((error) => {
                return reject(error);
            });
        
        });
        
    }

    postOrderContent(idArticle:number,idOrder:number):Promise<boolean>{

        const data = {
          id_article : idArticle,
          id_order   : idOrder
        };

        return new Promise<boolean>((resolve, reject) => { 

            this.http.post<any>(this.API_URL+'order/content',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
        
       
    
    }

    getAllOrderOneAccount(idClient:number): Observable<any>{

        return this.http.get(this.API_URL+'order/'+idClient) ;
    }

    getOrderContent(idOrder:number): Observable<any>{

        return this.http.get(this.API_URL+'order/content/'+idOrder) ;
    }


}