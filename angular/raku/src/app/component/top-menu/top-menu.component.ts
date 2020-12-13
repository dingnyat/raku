import {Component, OnInit} from '@angular/core';
import {faCog, faMusic, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../service/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AppService} from "../../service/app.service";
import {AppSettings} from "../../global/app-settings";
import {User} from "../../model/user";
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

  userInfo: User;
  isAuthenticated: boolean;
  faMusic = faMusic;

  constructor(public dialog: MatDialog,
              private authService: AuthenticationService,
              private cookieService: CookieService,
              public readonly router: Router,
              public appService: AppService) {
  }

  ngOnInit(): void {
    if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
      this.authService.getCurrentUser().subscribe(resp => {
        this.userInfo = resp.data as User;
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
            this.userInfo = resp.data as User;
            this.appService.setUser(this.userInfo);
            this.router.navigateByUrl("/");
          });
        }
      } else if (res?.username != null) {
        //TODO Do something to notify
        this.authService.login(res.username, res.password).subscribe(resp => {
          if (resp.success) {
            if (resp.data != null) {
              this.cookieService.set(AppSettings.COOKIE_TOKEN_NAME, resp.data.token,
                moment(new Date()).add(resp.data.expireTime, 'ms').toDate());
              this.authService.getCurrentUser().subscribe(resp => {
                this.userInfo = resp.data as User;
                this.appService.setUser(this.userInfo);
                this.router.navigateByUrl("/");
              });
            }
          }
        });

      }
    })
  }

  logout() {
    new Promise((func) => {
      this.cookieService.delete(AppSettings.COOKIE_TOKEN_NAME, "/");
      if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME) == null || this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME).trim() == "") {
        func();
      }
    }).then(() => {
      this.appService.setUser(null);
      /*this.router.navigate(["/"]);*/
      location.href = '/';
    });
  }
}
