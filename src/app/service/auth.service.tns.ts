import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { setString, getString } from "@nativescript/core/application-settings";
import { Observable, interval, pipe } from 'rxjs';
import { tap, catchError, map, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    public interval;

    private API_URL = environment.api_url;
    private user : User;
    private helper = new JwtHelperService();

    constructor(private http: HttpClient) { 
        this.user = new User();
      }

    login(email:string,password:string) :Promise<boolean> {

        this.user.email = email;
        this.user.password = password;

        return new Promise<boolean>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'login',this.user).toPromise().then( response => {

                this.updateDataSesion(response.token, response.refresh_token);
                
                return resolve(true);

        }).catch((error) => {
                return reject(error);
            });
        });        
    }
    
    refreshToken() :Promise<boolean> {

        if(getString('refresh_token'))
        {
            this.user = JSON.parse(getString('userData'));

            const data = {
                refreshToken : getString('refresh_token'),
                id : this.user.id
            }

            return new Promise<boolean>((resolve, reject) => {

                this.http.post<any>(this.API_URL+'refresh_token',data).toPromise().then((response)=> 
                {
                    this.updateDataSesion(response.token, response.refresh_token);

                    return resolve(true);

                }).catch((error) => {
                    this.interval.unsubscribe();
                    return reject(error);
                });


            });

        }
        else
        {
            this.interval.unsubscribe();
        }

    }

    checkingTokenOnInterval(intervalTime:number):void{
        this.interval = interval(intervalTime).subscribe(() => {
            this.refreshToken();
        })
    }

    updateDataSesion(token:string, refresh_token:string):void{

        setString('token', token);
        setString('refresh_token', refresh_token);

        if(!this.interval)
            {
                const dataUser = this.helper.decodeToken(token);
                const expToken = new Date(0);
                expToken.setUTCSeconds(dataUser.exp);
                const timeInMsc = new Date(expToken).getTime() - new Date().getTime();
                this.checkingTokenOnInterval(timeInMsc);
            }

        this.user = this.helper.decodeToken(token);
        setString('userData', JSON.stringify(this.user));
    }

   
}