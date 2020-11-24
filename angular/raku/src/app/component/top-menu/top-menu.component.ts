import {Component, OnInit} from '@angular/core';
import {faCog, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../service/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AppService} from "../../service/app.service";
import {AppSettings} from "../../global/app-settings";
import {UserPrincipal} from "../../model/UserPrincipal";
import {SignInUpFormComponent} from "./sign-in-up-form/sign-in-up-form.component";
import * as moment from 'moment';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  faUser = faUser;
  faSignOut = faSignOutAlt;
  faCog = faCog;

  userInfo: UserPrincipal;
  isAuthenticated: boolean;

  constructor(public dialog: MatDialog,
              private authService: AuthenticationService,
              private cookieService: CookieService,
              public readonly router: Router,
              public appService: AppService) {
  }

  ngOnInit(): void {
    if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
      this.authService.getCurrentUser().subscribe(resp => {
        this.userInfo = resp.data as UserPrincipal;
        this.appService.setUser(this.userInfo);
      }, error => {
      });
    }

    this.appService.userObs.subscribe(currUser => {
      if (currUser == null) {
        this.isAuthenticated = false;
      } else {
        this.userInfo = currUser;
        this.isAuthenticated = true;
      }
    })
  }

  showSignInUpDialog(type) {
    const dialogRef = this.dialog.open(SignInUpFormComponent, {
      width: "900px",
      height: "auto",
      disableClose: true,
      data: {success: false, type: type}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == "login_success") {
        if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
          this.authService.getCurrentUser().subscribe(resp => {
            this.userInfo = resp.data as UserPrincipal;
            location.reload();
          });
        }
      } else if (res?.username != null) {
        //TODO Do something to notify
        this.authService.login(res.username, res.password).subscribe(resp => {
          if (resp.success) {
            if (resp.data != null) {
              this.cookieService.set(AppSettings.COOKIE_TOKEN_NAME, resp.data.token,
                moment(new Date()).add(resp.data.expireTime, 'ms').toDate());
            }
            location.reload();
          }
        });

      }
    })
  }

  logout() {
    this.authService.logout().subscribe(resp => {
      this.cookieService.delete(AppSettings.COOKIE_TOKEN_NAME, null, null, null, 'Lax');
      this.appService.setUser(null);
      this.router.navigate(['/']);
    });
  }
}
