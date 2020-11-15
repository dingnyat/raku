import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";
import {AppSettings} from "../global/app-settings";
import {CookieService} from "ngx-cookie-service";
import {Observable, of} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private cookieService: CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
      this.authService.getCurrentUser().subscribe(resp => {
        if (route.data.roles && route.data.roles.indexOf(resp.data.role) === -1) {
          this.router.navigate(['/']);
          return of(false);
        }
        return of(true);
      }, err => {
        this.router.navigate(['/']);
        return of(false);
      });
    } else {
      return of(false);
    }
  }

}
