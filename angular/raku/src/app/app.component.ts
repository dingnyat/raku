import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AppService} from "./service/app.service";
import {AppSettings} from "./global/app-settings";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "./service/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  currentYear: number;
  showMediaPlayer: boolean;

  constructor(public appService: AppService, private cookieService: CookieService, private userService: UserService) {
    appService.trackQueueObs.subscribe(trackQueue => {
      this.showMediaPlayer = !(trackQueue == null || trackQueue?.length == 0);
    });

    userService.getAuthenticatedUserHistoryTracks().subscribe(resp => {
      if (resp.success) {
        resp.data.forEach(track => {
          track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
          track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;
          track.link = "/" + track.uploader.username + "/" + track.code;
        });
        this.appService.setTrackQueue(resp.data);
        this.appService.setQueueIdx(0);
      }
    })
  }

  ngOnInit(): void {
    this.currentYear = moment().get('y');
    if ('serviceWorker' in navigator) { // Make sure browser support Service Worker
      navigator.serviceWorker.register(`/sw.js?token=${'Bearer ' + this.cookieService.get(AppSettings.COOKIE_TOKEN_NAME)}`, {
        scope: '/'
      })
        .then(registration => registration.unregister());
      // SW unregistered still working till page reload, so don't worry.
      // But if you don't unregister here, Component may get stuck when you reload page,
      // because old SW is fetching video and not done yet.
      // In this case, If you stop playing video a while, page can be reload.
    } else {
      console.log('Browser not support Service Worker');
    }
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
}
