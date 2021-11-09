import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http"
import { Observable, throwError  } from "rxjs"
import { catchError } from "rxjs/operators";
import { AuthService } from '../service/auth.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { 

    }

    intercept( req: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
        
          return next.handle(req).pipe(catchError(error  => {

            if (error.status === 401 && sessionStorage.getItem('refresh_token') ) {
                this.authService.refreshToken().catch( errortwo =>
                  {
                    if(errortwo.status == 403)
                    {
                      this.authService.interval = null;
                      sessionStorage.clear();
                      this.router.navigate([""]).then(() => {
                        location.reload();
                      });

                    }
                  });
               }
            return throwError(error);

          }));
    }
  }