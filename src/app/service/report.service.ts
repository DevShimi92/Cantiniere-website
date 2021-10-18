import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class ReportService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient) { }

    sendReport(sujet:string, message:string): Promise<boolean>{

        let data;
        const dataUser = JSON.parse(sessionStorage.getItem('userData'));
        
        if(dataUser != null)
        {
            data = {
                subject :sujet,
                message :message,
                id:dataUser.id
            };
        }
        else
        {
            data = {
                subject :sujet,
                message :message,
            };
        }

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<void>(this.API_URL+'mail',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    }

   
}