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

  constructor(public songApp: AppService, private cookieService: CookieService, private userService: UserService) {
    songApp.songQueueObs.subscribe(songQueue => {
      this.showMediaPlayer = !(songQueue == null || songQueue?.length == 0);
    });

    userService.getAuthenticatedUserHistoryTracks().subscribe(resp => {
      if (resp.success) {
        resp.data.forEach(song => {
          song.imageUrl = song.imageUrl ? (AppSettings.ENDPOINT + "/" + song.uploader.username + "/image/" + song.imageUrl) : null;
          song.src = AppSettings.ENDPOINT + "/" + song.uploader.username + "/audio/" + song.code;
          song.link = "/" + song.uploader.username + "/" + song.code;
        });
        this.songApp.setSongQueue(resp.data);
        this.songApp.setQueueIdx(0);
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
