import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BaseService} from "../../service/base.service";
import {
  faGlasses,
  faHeadphones,
  faHeart,
  faList,
  faMusic,
  faPlay,
  faShare,
  faThumbtack,
  faUser,
  faUserCheck,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import {AppSettings} from "../../global/app-settings";
import {Title} from "@angular/platform-browser";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  faGlasses = faGlasses;
  faMusic = faMusic;
  faUser = faUser;
  faList = faList;
  faPlay = faPlay;
  faHeart = faHeart;
  faThumbtack = faThumbtack;
  faShare = faShare;
  faUserPlus = faUserPlus;
  faUserCheck = faUserCheck;
  faHeadphone = faHeadphones;

  searchReq = {};
  searchResults: any;

  constructor(private route: ActivatedRoute, private baseService: BaseService, private title: Title, private userService: UserService) {
    this.searchReq['key'] = 'track';
    this.searchReq['start'] = 0;
    this.searchReq['length'] = 6;
    this.route.queryParams.subscribe(params => {
      this.searchReq['value'] = params['keyword'];
      this.reloadResults();
    });
    this.title.setTitle("Search tracks on Raku")
  }

  ngOnInit(): void {
  }

  reloadResults() {
    this.baseService.search(this.searchReq).subscribe(resp => {
      if (resp.success) {
        this.searchResults = resp.data;
        this.searchResults.results.forEach(e => {
          if (e.value == "track") {
            e.key.imageUrl = e.key.imageUrl ? (AppSettings.ENDPOINT + "/" + e.key.uploader.username + "/image/" + e.key.imageUrl) : null;
          }
          if (e.value == "people") {
            this.userService.getUserStats(e.key.username).subscribe(r => {
              if (r.success) {
                e.key['stats'] = r.data;
              }
            });
          }
          if (e.value == "playlist") {
            e.key.tracks.forEach(track => {
              track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
            });
          }
        });
      }
    });
  }

  changeKey(key: string) {
    this.searchReq['key'] = key;
    this.reloadResults();
  }

  playTrack(track: any) {

  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  likeTrack(track: any) {

  }

  repostTrack(track: any) {

  }

  showShareDialog(track: any) {

  }

  addToPlaylist(track: any) {

  }

  playPlaylist(playlist: any) {

  }
}
