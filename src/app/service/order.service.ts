import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { OrderContent } from '../shared/models/orderContent.model';
import { OrderinfoAccount, OrderInfoRecap, OrderInfoRecapClient } from '../shared/models/orderInfo.model';

class IdOrder {
    id: number;
  }

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

            this.http.post<IdOrder>(this.API_URL+'order',data).toPromise().then((response) => {
                return resolve(response.id);
            }).catch((error) => {
                return reject(error);
            });
        
        });
        
    }

    postOrderContent(idOrder:number,idArticle:number=null,idMenu:number=null):Promise<boolean>{

        const data = {
          id_article : idArticle,
          id_order   : idOrder,
          id_menu    : idMenu
        };

        return new Promise<boolean>((resolve, reject) => { 

            if((idArticle == null) && (idMenu == null))
                return reject('Need Id Article or Id Menu !');

            this.http.post<void>(this.API_URL+'order/content',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
             
    }

    getAllOrderOneAccount(idClient:number): Observable<OrderinfoAccount[]>{

        return this.http.get<OrderinfoAccount[]>(this.API_URL+'order/'+idClient) ;
    }

    getOrderContent(idOrder:number): Observable<OrderContent[]>{

        return this.http.get<OrderContent[]>(this.API_URL+'order/content/'+idOrder) ;
    }

    getAllOrderOfOneDay(date:string) : Observable<OrderInfoRecapClient[]>{

        return this.http.get<OrderInfoRecapClient[]>(this.API_URL+'orderRecap/list/'+date) ;

    }

    getRecapOrder(date:string): Observable<OrderInfoRecap[]>{

        return this.http.get<OrderInfoRecap[]>(this.API_URL+'orderRecap/'+date) ;
        
    }


    putValidOrder(idOrder:number):Promise<boolean>{

        const data = { id_order : idOrder };
        return new Promise<boolean>((resolve, reject) => {
        
            this.http.put<void>(this.API_URL+'order/valid',data ).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });
        });

    }

    deleteOrder(idOrder:number):Promise<boolean>{

        const data = { id_order : idOrder };

        return new Promise<boolean>((resolve, reject) => {
        
            this.http.request<void>('delete',this.API_URL+'order',{ body :data }).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                    return reject(error);
                });
        });
        
    }

}