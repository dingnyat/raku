import {Component, OnInit} from '@angular/core';
import {faCog, faMusic, faShieldAlt, faSignOutAlt, faStream, faUser} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../service/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AppSettings} from "../../global/app-settings";
import {User} from "../../model/user";
import {SignInUpFormComponent} from "./sign-in-up-form/sign-in-up-form.component";
import * as moment from 'moment';
import {UserSecurityComponent} from "../user-security/user-security.component";
import {BaseController} from "../base.controller";

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent extends BaseController implements OnInit {
  faUser = faUser;
  faSignOut = faSignOutAlt;
  faCog = faCog;
  faStream = faStream;
  faMusic = faMusic;
  faShieldAlt = faShieldAlt;

  loggedInUser: User;
  searchKeyword: string;

  constructor(public dialog: MatDialog,
              private authService: AuthenticationService,
              private cookieService: CookieService,
              public readonly router: Router) {
    super();
  }

  ngOnInit(): void {
    if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
      this.authService.getCurrentUser().subscribe(resp => {
        this.loggedInUser = resp.data as User;
        this.appService.setUser(this.loggedInUser);
      }, error => {
      });
    }
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
            this.loggedInUser = resp.data as User;
            this.appService.setUser(this.loggedInUser);
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
                this.loggedInUser = resp.data as User;
                this.appService.setUser(this.loggedInUser);
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

  showUserSecurity() {
    const dialogRef = this.dialog.open(UserSecurityComponent, {
      width: "600px",
      height: "auto",
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(res => {
    })
  }

  search() {
    if (this.searchKeyword != null && this.searchKeyword.trim() != "") {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigateByUrl("/search?keyword=" + encodeURI(this.searchKeyword));
      });
    }
  }
}
