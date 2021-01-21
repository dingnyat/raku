import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Track} from "../../model/track";
import {TrackService} from "../../service/track.service";
import {AppSettings} from "../../global/app-settings";
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
import {AppService} from "../../service/app.service";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer";
import {UserService} from "../../service/user.service";
import {UserTrackInfo} from "../../model/user-track-info";
import {TrackStats} from "../../model/track-stats";
import {UserStats} from "../../model/user-stats";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {ShareDialogComponent} from "../share-dialog/share-dialog.component";
import {AddToPlaylistComponent} from "../add-to-playlist/add-to-playlist.component";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";
import {BaseController} from "../base.controller";

@Component({
  selector: 'track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css']
})
export class TrackDetailsComponent extends BaseController implements OnInit, AfterViewInit, OnDestroy {

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

  username: string;
  code: string;

  track: Track;
  isPlaying = false;
  wavesurfer: any;
  busy = false;
  currTimeStr: string;
  durationStr: string;
  userTrackInfo: UserTrackInfo;
  trackStats: TrackStats;
  uploaderStats: UserStats;

  constructor(private route: ActivatedRoute,
              private trackService: TrackService,
              private titleService: Title,
              private userService: UserService,
              public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params.username;
      this.code = params.code;

      this.trackService.getByCode(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.track = resp.data as Track;
          this.track.imageUrl = this.track.imageUrl ? (AppSettings.ENDPOINT + "/" + this.username + "/image/" + this.track.imageUrl) : null;
          this.track.src = AppSettings.ENDPOINT + "/" + this.username + "/audio/" + this.track.code;
          this.track.link = "/" + this.username + "/" + this.track.code;
          this.titleService.setTitle(this.track.title + " || Listening on Raku");

          if (this.wavesurfer) {
            this.wavesurfer.load(AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.track.code);
          }
        }
      });

      this.trackService.getUserTrackInfo(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.userTrackInfo = resp.data as UserTrackInfo;
        }
      });

      this.trackService.getTrackStats(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.trackStats = resp.data;
        }
      });

      this.userService.getUserStats(this.username).subscribe(resp => {
        if (resp.success) {
          this.uploaderStats = resp.data;
        }
      });

    });
    this.appService.playStateObs.subscribe(state => {
      this.isPlaying = state;
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
      this.durationStr = new Date(this.wavesurfer.getDuration() * 1000).toISOString().substr(11, 8);
      if (this.durationStr.substr(0, 2) == '00') {
        this.durationStr = this.durationStr.substr(3, 5);
      }
    });

    document.getElementById('audio-wave').addEventListener('mousedown', (e) => {
      this.busy = true;
    });

    document.getElementById('audio-wave').addEventListener('mouseup', (e) => {
      this.playTrack();
      setTimeout(() => {
        this.appService.setSeekTime(this.wavesurfer.getCurrentTime());
        this.busy = false;
      }, 100);
    });

    this.appService.currTimeObs.subscribe(time => {
      if (time != null && (this.track?.code == this.appService.getCurrentTrack()?.code) && !this.busy) {
        let target = time / (this.wavesurfer.getDuration() == 0 ? 1 : this.wavesurfer.getDuration());
        this.wavesurfer.seekTo(target >= 1 ? 1 : (target <= 0 ? 0 : target));
        this.currTimeStr = new Date(time * 1000).toISOString().substr(11, 8);
        if (this.currTimeStr.substr(0, 2) == '00') {
          this.currTimeStr = this.currTimeStr.substr(3, 5);
        }
      }
    });

    this.appService.currTrackObs.subscribe(track => {
      if (this.track?.id != track?.id) {
        this.wavesurfer.seekTo(0);
      }
    })

    this.trackService.getByCode(this.username, this.code).subscribe(resp => {
      if (resp.success) {
        this.track = resp.data as Track;
        this.track.imageUrl = this.track.imageUrl ? (AppSettings.ENDPOINT + "/" + this.username + "/image/" + this.track.imageUrl) : null;
        this.track.src = AppSettings.ENDPOINT + "/" + this.username + "/audio/" + this.track.code;
        this.track.link = "/" + this.username + "/" + this.track.code;
        this.titleService.setTitle(this.track.title + " || Listening on Raku");
        this.wavesurfer.load(AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.track.code);
      }
    });
  }

  ngOnDestroy() {
    document.getElementById("audio-wave").remove();
    this.wavesurfer.destroy();
  }

  playTrack() {
    if (this.track?.code == this.appService.getCurrentTrack()?.code) {
      if (!this.appService.getPlayState()) {
        this.appService.setPlayState(true);
      }
    } else {
      this.appService.setTrackQueue([this.track]);
      this.appService.setQueueIdx(0);
      this.appService.setPlayState(true);
    }
  }

  pauseTrack() {
    this.appService.setPlayState(false);
  }

  likeTrack() {
    if (this.appService.getCurrentUser() != null) {
      this.userService.likeTrack(this.track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(this.username, this.code).subscribe(r => {
            if (r.success) {
              this.userTrackInfo.like = r.data.like;
              // xong thì nhảy số like của track ở stats lên (trên view)
            }
          });
          this.trackService.getTrackStats(this.username, this.code).subscribe(resp => {
            if (resp.success) {
              this.trackStats = resp.data;
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  repostTrack() {
    if (this.appService.getCurrentUser() != null) {
      this.userService.repostTrack(this.track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(this.username, this.code).subscribe(r => {
            if (r.success) {
              this.userTrackInfo.repost = r.data.repost;
              // xong thì nhảy số repost của track ở stats lên (trên view)
            }
          });
          this.trackService.getTrackStats(this.username, this.code).subscribe(resp => {
            if (resp.success) {
              this.trackStats = resp.data;
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  followUploader() {
    if (this.appService.getCurrentUser() != null) {
      this.userService.followUser(this.track.uploader.username).subscribe(resp => {
        if (resp.success) {
          this.userService.getUserStats(this.username).subscribe(r => {
            if (r.success) {
              this.uploaderStats = r.data;
              // xong thì nhảy số follow của uploader ở dưới avatar lên
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  comment(event) {
    if (this.appService.getCurrentUser() != null) {
      if (event.target.value != null && event.target.value.trim() != '') {
        this.userService.comment({trackId: this.track.id, content: event.target.value}).subscribe(resp => {
          if (resp.success) {
            event.target.value = '';
            this.reloadComment();
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  reloadComment() {
    console.log("reload comment");
    this.trackService.getByCode(this.username, this.code).subscribe(r => {
      if (r.success) {
        this.track.comments = r.data.comments;
      }
    })
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  showShareDialog(track: Track) {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: "500px",
      height: "auto",
      data: {track: track}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    })
  }

  addToPlaylist(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      const dialogRef = this.dialog.open(AddToPlaylistComponent, {
        width: "500px",
        height: "auto",
        data: {track: track}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }

  }
}
