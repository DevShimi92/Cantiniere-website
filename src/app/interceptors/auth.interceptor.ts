import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http"
import { Observable } from "rxjs"

@Injectable()

export class AuthInterceptor implements HttpInterceptor {


    intercept( req: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {

        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
          });
        
          return next.handle(authReq);
    }
  }