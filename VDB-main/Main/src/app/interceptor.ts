// export interface Interceptor {


// }
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// @Injectable()
// export class  implements HttpInterceptor {
  // intercept(req: HttpRequest<any>, next: HttpHandler):  {
    // throw new Error('Method not implemented.');
  // }
  // private readonly API_KEY = '33zBrmCUqoJ7';

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const clonedRequest = req.clone({
  //     setHeaders: {
  //       'X-API-KEY': this.API_KEY
  //     }
  //   });

  //   return next.handle(clonedRequest);
  // }
// }
