import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getString } from "@nativescript/core/application-settings";

import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class ReportService {

    private API_URL = environment.api_url;
    private user : User;

    constructor(private http: HttpClient) {
        this.user = new User();
     }

    sendReport(sujet:string, message:string): Promise<boolean>{

        let data;

        if(getString('userData'))
        {
            this.user = JSON.parse(getString('userData'));
            data = {
                subject :sujet,
                message :message,
                id:this.user.id
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

            this.http.post<any>(this.API_URL+'mail',data).toPromise().then( () => {
                return resolve(true);
            }).catch((error) => {
                return reject(error);
            });

        });
    }

   
}