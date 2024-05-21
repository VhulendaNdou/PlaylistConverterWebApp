import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, delay, EMPTY, map, Observable, retryWhen } from 'rxjs';
import { LoginComponent } from 'src/app/components/login/login.component';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private login: LoginComponent, private alert: AlertComponent ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("in");
    if(request.url.includes('login')){
      return this.loginIntercept(request,next);
    }
    
    return next.handle(request);
  }

  loginIntercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      
        catchError(err => {
          console.log('error' + err.status);
          if (err.status === 0) {
              this.alert.showAlert("Something went wrong. Try again");
          }
          else if (err.status === 500) {
            this.alert.showAlert("Something went wrong. Try again");
          }
          else if (err.status === 401) {
            this.alert.showAlert("Incorrect Login details. Try login again");
          }
          //show that there is an error in the upload page
          return EMPTY;
        }),
        retryWhen(err => {
          let retryRequestCount = 1;// remove later
          return err.pipe(
              delay(1000),
              map(error => {
                  if(retryRequestCount === 2){
                      throw error;
                  }
                  else{
                      retryRequestCount++;
                  }
                  return error;
              })
          );
      })
    );
  }

  
}
