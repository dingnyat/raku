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
import {OwlOptions} from "ngx-owl-carousel-o";
import {Track} from "../../model/track";
import {TrackService} from "../../service/track.service";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  faPlay = faPlay;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
  }

  top40: Track[];

  constructor(private appService: AppService,
              public dialog: MatDialog,
              private authService: AuthenticationService,
              private cookieService: CookieService,
              public readonly router: Router,
              private trackService: TrackService) {
    this.user = this.appService.getCurrentUser();
    this.appService.userObs.subscribe(user => {
      this.user = user;
    })

    this.trackService.getTop40().subscribe(resp => {
      if (resp.success) {
        this.top40 = resp.data;
        this.top40.forEach(track => {
          track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
          track.link = "/" + track.uploader.username + "/" + track.code;
        });
      }
    });
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
