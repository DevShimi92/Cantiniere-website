import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

class Setting {
    hourlimit: string;
    totalOrderLimitAccountDay: number;
    totalOrderLimitDay: number;
    canPreOrder: string;
  }


@Injectable({
    providedIn: 'root'
  })

  export class SettingService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient) { }

    getAllSetting():Observable<Setting>{
        return this.http.get<Setting>(this.API_URL+'setting') ;
    }

    putHourLimit( hour_limit : string) : Promise<boolean>{
        
      const data = { hour_limit: hour_limit };

      return new Promise<boolean>((resolve, reject) => {

          this.http.put<void>(this.API_URL+'setting/hour_limit',data).toPromise().then( () => {
              return resolve(true);
          }).catch((error) => {
              return reject(error);
          });

      });
    }

    putTotalOrderLimitDay( Total: number ) : Promise<boolean>{
        
      const data = { nb_limit_per_day: Total };

      return new Promise<boolean>((resolve, reject) => {

          this.http.put<void>(this.API_URL+'setting/order_total_limit',data).toPromise().then( () => {
              return resolve(true);
          }).catch((error) => {
              return reject(error);
          });

      });
    }

    putTotalOrderLimitAccountPerDay( Total: number ) : Promise<boolean>{

      const data = { nb_limit_per_account: Total };

      return new Promise<boolean>((resolve, reject) => {

          this.http.put<void>(this.API_URL+'setting/order_total_limit_account',data).toPromise().then( () => {
              return resolve(true);
          }).catch((error) => {
              return reject(error);
          });

      });
        
    }

    putCanPreOrder(canOrder : boolean) : Promise<boolean> {

      const data = { order_in_advance: canOrder };

        return new Promise<boolean>((resolve, reject) => {

            this.http.put<void>(this.API_URL+'setting/pre_order',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
        
    }

  }