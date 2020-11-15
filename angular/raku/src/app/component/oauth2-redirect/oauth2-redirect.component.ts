import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSettings} from "../../global/app-settings";
import * as moment from 'moment';

@Component({
  selector: 'app-oauth2-redirect',
  templateUrl: './oauth2-redirect.component.html',
  styleUrls: ['./oauth2-redirect.component.css']
})
export class Oauth2RedirectComponent implements OnInit {

  constructor(protected readonly route: ActivatedRoute,
              protected readonly router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    console.log("redirected");
    this.route.queryParams.subscribe(params => {
      if (params['token'] != null) {
        console.log(params['token']);
        this.cookieService.set(AppSettings.COOKIE_TOKEN_NAME, params['token'], moment(new Date()).add(AppSettings.COOKIE_TOKEN_EXPIRE_TIME, 's').toDate(), "/");
        location.href = "/";
      }
    })
  }

}
