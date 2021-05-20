import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class UserService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient, private authService: AuthService) { }

    createUser(user:User):Promise<boolean> {
    
        return new Promise<boolean>((resolve, reject) => {

            this.http.post<any>(this.API_URL+'user',user).toPromise().then( response => {

                this.authService.updateDataSesion(response.token, response.refresh_token);
                return resolve(true);

            }).catch((error) => {
                return reject(error);
            });

        });
    } 

    getAllUser(): Observable<any>{
    
        return this.http.get(this.API_URL+'user') ;
    }
    

    updateUser(user:User):Promise<boolean>{
    
        return new Promise<boolean>((resolve, reject) => {

            this.http.put<any>(this.API_URL+'user',user).toPromise().then( () => {

                this.authService.refreshToken().then(() => {
                    return resolve(true);
                }).catch((error) => {
                    return reject(error);
                });

            }).catch((error) => {
                return reject(error);
            });

        })
       
    }

   
}