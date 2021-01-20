import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Playlist} from "../../model/playlist";
import {ActivatedRoute} from "@angular/router";
import {PlaylistService} from "../../service/playlist.service";
import {Title} from "@angular/platform-browser";
import {
  faCommentAlt,
  faEllipsisH,
  faHeadphones,
  faHeart,
  faList,
  faMusic,
  faPause,
  faPlay,
  faReply,
  faShare,
  faThumbtack,
  faUserCheck,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import {UserStats} from "../../model/user-stats";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {AppService} from "../../service/app.service";
import {AppSettings} from "../../global/app-settings";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer";


@Component({
  selector: 'playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  faPlay = faPlay;
  faPause = faPause;
  faHeart = faHeart;
  faThumbtack = faThumbtack;
  faShare = faShare;
  faEllipsisH = faEllipsisH;
  faHeadphones = faHeadphones;
  faCommentAlt = faCommentAlt;
  faUserCheck = faUserCheck;
  faMusic = faMusic;
  faUserPlus = faUserPlus;
  faReply = faReply;
  faList = faList;
  faHeadphone = faHeadphones;

  playlist: Playlist;

  username: string;
  code: string;

  uploaderStats: UserStats;
  user: User;

  currTimeStr: string;
  durationStr: string;

  // cách chống chế phông bạt :) dont mind
  playState = false;
  wavesurfer: any;

  constructor(private route: ActivatedRoute,
              private playlistService: PlaylistService,
              private titleService: Title,
              private userService: UserService,
              private appService: AppService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params.username;
      this.code = params.code;

      this.playlistService.find(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.playlist = resp.data;
          this.playlist.tracks.forEach(track => {
            track.link = "/" + track.uploader.username + "/" + track.code;
            track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
            track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;
          })
          this.titleService.setTitle(this.playlist.title + " || Raku Music");
        }
      });

      this.userService.getUserStats(this.username).subscribe(resp => {
        if (resp.success) {
          this.uploaderStats = resp.data;
        }
      });

      this.appService.userObs.subscribe(user => {
        this.user = user;
      })

    });
  }

  ngAfterViewInit(): void {
    this.wavesurfer = WaveSurfer.create({
      container: '#audio-wave',
      waveColor: 'white',
      progressColor: '#ff5500',
      barWidth: 2,
      barHeight: 1,
      barGap: null,
      height: 100,
      cursorWidth: 0,
      hideScrollbar: true,
      responsive: true,
      xhr: {
        cache: 'default',
        mode: 'cors',
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'client',
        headers: []
      }
    });

    this.wavesurfer.on('ready', () => {
    });

    this.playlistService.find(this.username, this.code).subscribe(resp => {
      if (resp.success) {
        this.playlist = resp.data;
        if (this.wavesurfer){
          if (this.playlist.tracks.length > 0) {
            this.wavesurfer.load(AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.playlist.tracks[0].code);
          }
        }
        this.playlist.tracks.forEach(track => {
          track.link = "/" + track.uploader.username + "/" + track.code;
          track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
          track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;
        })
        this.titleService.setTitle(this.playlist.title + " || Raku Music");
      }
    });
  }

  ngOnDestroy() {
    document.getElementById("audio-wave").remove();
    this.wavesurfer.destroy();
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  showShareDialog(playlist: Playlist) {

  }

  followUploader() {

  }

  pausePlaylist() {
    this.playState = !this.playState;
    this.appService.setPlayState(false);
  }

  playPlaylist() {
    this.appService.setTrackQueue(this.playlist.tracks);
    this.appService.setQueueIdx(0);
    this.appService.setPlayState(true);
    this.playState = !this.playState;
  }
}
