import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let currUser = localStorage.getItem("current-user") ? JSON.parse(localStorage.getItem("current-user")) : null;
    if (currUser) {
      if (route.data.roles && route.data.roles.indexOf(currUser.role) === -1) {
        this.router.navigate(['/no-permission']);
        return of(false);
      }
      return of(true);
    }
    this.router.navigate(['/error'], {queryParams: {login: false}});
    return of(false);
  }

}
