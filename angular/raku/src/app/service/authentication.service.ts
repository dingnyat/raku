import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService {

  constructor(private cookieService: CookieService) {
    super();
    this.contextUrl = "/auth";
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + '/login', {username: username, password: password});
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + '/get-me');
  }

  logout(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + '/logout');
  }

  register(body: any): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + '/signup', body);
  }

  verifyEmailKey(key: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/email-verify", {params: {key: key}});
  }
}
