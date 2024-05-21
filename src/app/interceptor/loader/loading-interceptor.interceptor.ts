import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader/loader.service';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Route, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    private loadingService: LoaderService,private router: Router,
    private app: AppComponent
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    this.totalRequests++;
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      catchError(err => {
        console.log(err)
        const callout = document.getElementById('alert');
        const message = document.getElementById('message');
        
        if (message) {
          message.textContent = "Something went wrong. Try again";
        }

        if (request.url.includes("login")) {
          if (err.status === 401) {
            if (message) {
              message.textContent = "Incorrect Login details. Try login again";
            }
          }
        }
        else {
          if (err.status === 401) {
            if (message) {
              message.textContent = "Please login again";
            }
            this.router.navigate(['/login'])
          }
        }

        if (callout) {
          callout.style.display = 'block';
          // delay(10000)
          // callout.style.display = 'none';
        }
        
        //show that there is an error in the upload page
        return EMPTY;
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
