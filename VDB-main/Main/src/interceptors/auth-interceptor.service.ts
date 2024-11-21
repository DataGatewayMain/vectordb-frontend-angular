import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the authentication token from the AuthService
    const authToken = this.authService.getToken(); // You can replace this with your method of getting the token

    // Clone the request and add the Authorization header if the token is available
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Handle the request
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          this.snackbar.open('Session expired. Please log in again.', 'Close', { duration: 4000 });
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Handle forbidden access
          this.snackbar.open('You do not have permission to access this resource.', 'Close', { duration: 4000 });
        }

        return throwError(error); // Pass the error to the caller
      })
    );
  }
}
