import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User, UserList } from '../shared/models/user.model';
import { Token } from '../shared/models/token.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class UserService {

    private API_URL = environment.api_url;

    constructor(private http: HttpClient, private authService: AuthService) { }

    createUser(user:User):Promise<boolean> {
    
        return new Promise<boolean>((resolve, reject) => {

            this.http.post<Token>(this.API_URL+'user',user).toPromise().then( response => {

                this.authService.updateDataSesion(response.token, response.refresh_token);
                return resolve(true);

            }).catch((error) => {
                return reject(error);
            });

        });
    } 

    getAllUser(): Observable<UserList[]>{
    
        return this.http.get<UserList[]>(this.API_URL+'user') ;
    }
    
    updateUser(user:User):Promise<boolean>{
    
        return new Promise<boolean>((resolve, reject) => {

            this.http.put<void>(this.API_URL+'user',user).toPromise().then( () => {

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