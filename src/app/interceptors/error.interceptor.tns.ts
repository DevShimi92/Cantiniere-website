import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { getString, clear } from "@nativescript/core/application-settings";
import { RouterExtensions } from "@nativescript/angular";
import { Observable, throwError  } from "rxjs"
import { catchError } from "rxjs/operators";
import { AuthService } from '../service/auth.service.tns';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { 

    }

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

          return next.handle(req).pipe(catchError(error  => {

            if (error.status === 401 && getString('refresh_token') ) {
                this.authService.refreshToken().catch( errorTwo =>
                  {
                    
                    if(errorTwo.status == 403)
                    {
                      this.authService.interval = null;
                      clear();
                      this.routerExtensions.navigate(["/login"], { clearHistory: true });

                    }
                  });
               }
            return throwError(error);

          }));
    }
  }