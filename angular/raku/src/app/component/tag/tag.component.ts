import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Track} from "../../model/track";
import {TrackService} from "../../service/track.service";
import * as moment from "moment";
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
import {AppSettings} from "../../global/app-settings";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
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

  code: string;
  tracks: Track[];

  constructor(private route: ActivatedRoute, trackService: TrackService) {
    this.route.params.subscribe(params => {
      this.code = params.code;
      trackService.getTracksByTag(this.code).subscribe(resp => {
        if (resp.success) {
          this.tracks = resp.data;
          this.tracks.forEach(track => {
            track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
          })
        }
      });
    });
  }

  ngOnInit(): void {
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

  playTrack(track: any) {
  }
}
