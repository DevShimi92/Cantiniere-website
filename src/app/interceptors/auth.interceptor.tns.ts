import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http"
import { getString } from "@nativescript/core/application-settings";

import { Observable } from "rxjs"

@Injectable()

export class AuthInterceptor implements HttpInterceptor {


    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        const authReq = req.clone({
            headers: req.headers.set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${getString('token')}`)
          });
        
          return next.handle(authReq);
    }
  }