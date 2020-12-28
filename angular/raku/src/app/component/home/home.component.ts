import {Component, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import {User} from "../../model/user";
import {MatDialog} from "@angular/material/dialog";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";
import {AppSettings} from "../../global/app-settings";
import * as moment from "moment";
import {AuthenticationService} from "../../service/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(private appService: AppService,
              public dialog: MatDialog,
              private authService: AuthenticationService,
              private cookieService: CookieService,
              public readonly router: Router,) {
    this.user = this.appService.getCurrentUser();
    this.appService.userObs.subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  showSignupDialog() {
    const dialogRef = this.dialog.open(SignInUpFormComponent, {
      width: "900px",
      height: "auto",
      disableClose: true,
      data: {success: false, type: "signup"}
    });
    
    dialogRef.afterClosed().subscribe(res => {
      if (res == "login_success") {
        if (this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)) {
          this.authService.getCurrentUser().subscribe(resp => {
            this.user = resp.data as User;
            this.appService.setUser(this.user);
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
                this.user = resp.data as User;
                this.appService.setUser(this.user);
                this.router.navigateByUrl("/");
              });
            }
          }
        });

      }
    })
  }
}
