import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getString } from "@nativescript/core/application-settings";

import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';
import { LoaderService } from "./loader.service"


@Injectable({
    providedIn: 'root'
  })

export class ReportService {

    private API_URL = environment.api_url;
    private user : User;

    constructor(private http: HttpClient, private loaderService: LoaderService) {
        this.user = new User();
     }

    sendReport(sujet:string, message:string): Promise<boolean>{
        
        this.loaderService.onRequestStart();
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

            this.http.post<void>(this.API_URL+'mail',data).toPromise().then( () => {
                this.loaderService.onRequestEnd();
                return resolve(true);
            }).catch((error) => {
                this.loaderService.onRequestEnd();
                return reject(error);
            });

        });
    }

   
}