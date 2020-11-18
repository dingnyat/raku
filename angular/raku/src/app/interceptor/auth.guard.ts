import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import {Observable, of} from "rxjs";
import {AppService} from "../service/app.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private appService: AppService,
    private cookieService: CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let currUser = this.appService.getCurrentUser();
    if (currUser) {
      if (route.data.roles && route.data.roles.indexOf(currUser.role) === -1) {
        this.router.navigate(['/no-permission']);
        return of(false);
      }
      return of(true);
    }
    this.router.navigate(['/'], {queryParams: {login: false}});
    return of(false);
  }

}
