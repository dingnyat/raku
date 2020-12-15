import {Component, OnInit, ViewChild} from '@angular/core';
import {PlyrComponent} from "ngx-plyr";
import * as Plyr from "../../app.component";
import {
  faChevronDown,
  faEllipsisH,
  faHeart,
  faPause,
  faPlay,
  faRandom,
  faStepBackward,
  faStepForward,
  faStream,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import {AppService} from "../../service/app.service";
import {Track} from "../../model/track";
import {LoopType} from "./loop-type";
import {UserService} from "../../service/user.service";
import {TrackService} from "../../service/track.service";
import {UserTrackInfo} from "../../model/user-track-info";
import {MatDialog} from "@angular/material/dialog";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";

@Component({
  selector: 'media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {

  faStepBackward = faStepBackward;
  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faRandom = faRandom;
  faUndo = faUndo;
  faHeart = faHeart;
  faStream = faStream;
  faEllipsis = faEllipsisH;
  faChevronDown = faChevronDown;

  trackQueue: Track[];
  currTrackIdx: number;

  @ViewChild(PlyrComponent, {static: true})
  plyr: PlyrComponent;
  player: Plyr;

  isPlaying = false;

  currentAudio: any[];

  isShowTrackQueue: boolean;

  loopType = LoopType.NONE;

  userTrackInfo: UserTrackInfo[] = [];
  currentUserTrackInfo: UserTrackInfo;

  constructor(private appService: AppService, private userService: UserService, private trackService: TrackService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.appService.currTrackObs.subscribe(track => {
      if (track != null) {
        this.currentAudio = [track];
        if (this.isPlaying) {
          this.playAudio();
        }
        this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(resp => {
          if (resp.success) {
            this.currentUserTrackInfo = resp.data;
          }
        })
      } else {
        this.currentAudio = null;
      }
    });
    this.appService.trackQueueObs.subscribe(trackQueue => {
      this.trackQueue = trackQueue;
      if (this.trackQueue != null) {
        this.trackQueue.forEach((value, index) => {
          this.trackService.getUserTrackInfo(value.uploader.username, value.code).subscribe(resp => {
            if (resp.success) {
              this.userTrackInfo[index] = resp.data;
            }
          })
        })
      }
    });
    this.appService.queueIdxObs.subscribe(idx => {
      this.currTrackIdx = idx;
      if (this.trackQueue != null && this.trackQueue.length > 0 && this.currTrackIdx >= 0) {
        this.appService.setCurrentTrack(this.trackQueue[this.currTrackIdx]);
      } else {
        this.appService.setCurrentTrack(null);
      }
    });

    this.isShowTrackQueue = false;
    this.loopType = LoopType.NONE;
  }

  onInitPlayer($event: any) {
    this.player = $event;
    this.appService.playStateObs.subscribe(state => {
      this.isPlaying = state;
      if (this.player != undefined) {
        if (this.isPlaying) {
          this.playAudio();
        } else {
          this.pauseAudio();
        }
      }
    });
    this.appService.seekTimeObs.subscribe(time => {
      this.player.currentTime = time;
    });
    this.player.on('timeupdate', e => {
      this.appService.setCurrentTime(e.detail.plyr.currentTime);
    });
  }

  playAudio(now?: boolean) {
    setTimeout(() => {
      if (this.player['ready']) {
        if (!now) {
          setTimeout(() => {
            this.player.play();
          }, 300);
        } else {
          this.player.play();
        }
      }
    }, 100);
  }

  pauseAudio() {
    this.player.pause();
  }

  onPauseAudio() {
    this.appService.setPlayState(false);
  }

  onPlayAudio() {
    this.appService.setPlayState(true);
  }

  nextAudio() {
    this.appService.setQueueIdx((this.currTrackIdx + 1 > this.trackQueue.length - 1) ? this.currTrackIdx : this.currTrackIdx + 1);
    if (this.isPlaying) {
      this.playAudio();
    }
  }

  previousAudio() {
    this.appService.setQueueIdx((this.currTrackIdx - 1 < 0) ? this.currTrackIdx : this.currTrackIdx - 1);
    if (this.isPlaying) {
      this.playAudio();
    }
  }

  loopAudio() {
    this.loopType = (this.loopType == LoopType.NONE ? LoopType.ONE : (this.loopType == LoopType.ONE ? LoopType.ALL : LoopType.NONE));
    this.player.loop = this.loopType == LoopType.ONE;
  }

  onTrackEnd() {
    if (this.currTrackIdx < this.trackQueue.length - 1) {
      this.appService.setQueueIdx(this.currTrackIdx + 1);
      this.playAudio();
    } else {
      if (this.loopType == LoopType.ALL) {
        this.appService.setQueueIdx(0);
        this.playAudio();
      }
    }
  }

  showTrackQueue() {
    this.isShowTrackQueue = !this.isShowTrackQueue;
  }

  playFromQueue(idx: number) {
    if (idx !== this.currTrackIdx) {
      this.appService.setQueueIdx(idx);
      this.playAudio();
    } else {
      this.playAudio();
    }
  }

  pauseFromQueue() {
    this.pauseAudio();
  }

  removeAllTracksInQueue() {
    this.appService.setCurrentTime(0);
    this.appService.setTrackQueue([]);
    this.appService.setQueueIdx(0);
    this.appService.setPlayState(false);
  }

  public get typeOfLoop(): typeof LoopType {
    return LoopType;
  }

  likeTrack(track: Track, idx: number) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.likeTrack(track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(r => {
            if (r.success) {
              this.userTrackInfo[idx] = r.data;
              if (idx == this.currTrackIdx) this.currentUserTrackInfo = r.data;
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

  likeCurrentTrack(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.likeTrack(track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(r => {
            if (r.success) {
              this.currentUserTrackInfo = r.data;
              this.userTrackInfo[this.currTrackIdx] = r.data;
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
}
