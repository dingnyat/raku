import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {AppSettings} from "../global/app-settings";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url === AppSettings.ENDPOINT + '/auth/login') return next.handle(request);
    if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)}`
        }
      });
    }
    return next.handle(request);
  }
}
