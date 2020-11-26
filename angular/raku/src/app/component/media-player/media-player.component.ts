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
import {Song} from "../../model/Song";
import {LoopType} from "./loop-type";
import {UserService} from "../../service/user.service";
import {TrackService} from "../../service/track.service";
import {UserTrackInfo} from "../../model/user-track-info";

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

  songQueue: Song[];
  currSongIdx: number;

  @ViewChild(PlyrComponent, {static: true})
  plyr: PlyrComponent;
  player: Plyr;

  isPlaying = false;

  currentAudio: any[];

  isShowSongQueue: boolean;

  loopType = LoopType.NONE;

  userTrackInfo: UserTrackInfo[] = [];
  currentUserTrackInfo: UserTrackInfo;

  constructor(private appService: AppService, private userService: UserService, private trackService: TrackService) {
  }

  ngOnInit(): void {
    this.appService.currSongObs.subscribe(song => {
      if (song != null) {
        this.currentAudio = [song];
        if (this.isPlaying) {
          this.playAudio();
        }
        this.trackService.getUserTrackInfo(song.uploader.username, song.code).subscribe(resp => {
          if (resp.success) {
            this.currentUserTrackInfo = resp.data;
          }
        })
      } else {
        this.currentAudio = null;
      }
    });
    this.appService.songQueueObs.subscribe(songQueue => {
      this.songQueue = songQueue;
      if (this.songQueue != null) {
        this.songQueue.forEach((value, index) => {
          this.trackService.getUserTrackInfo(value.uploader.username, value.code).subscribe(resp => {
            if (resp.success) {
              this.userTrackInfo[index] = resp.data;
            }
          })
        })
      }
    });
    this.appService.queueIdxObs.subscribe(idx => {
      this.currSongIdx = idx;
      if (this.songQueue != null && this.songQueue.length > 0 && this.currSongIdx >= 0) {
        this.appService.setCurrentSong(this.songQueue[this.currSongIdx]);
      } else {
        this.appService.setCurrentSong(null);
      }
    });

    this.isShowSongQueue = false;
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
    if (this.player['ready']) {
      if (!now) {
        setTimeout(() => {
          this.player.play();
        }, 500);
      } else {
        this.player.play();
      }
    }
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
    this.appService.setQueueIdx((this.currSongIdx + 1 > this.songQueue.length - 1) ? this.currSongIdx : this.currSongIdx + 1);
    if (this.isPlaying) {
      this.playAudio();
    }
  }

  previousAudio() {
    this.appService.setQueueIdx((this.currSongIdx - 1 < 0) ? this.currSongIdx : this.currSongIdx - 1);
    if (this.isPlaying) {
      this.playAudio();
    }
  }

  loopAudio() {
    this.loopType = (this.loopType == LoopType.NONE ? LoopType.ONE : (this.loopType == LoopType.ONE ? LoopType.ALL : LoopType.NONE));
    this.player.loop = this.loopType == LoopType.ONE;
  }

  onSongEnd() {
    if (this.currSongIdx < this.songQueue.length - 1) {
      this.appService.setQueueIdx(this.currSongIdx + 1);
      this.playAudio();
    } else {
      if (this.loopType == LoopType.ALL) {
        this.appService.setQueueIdx(0);
        this.playAudio();
      }
    }
  }

  showSongQueue() {
    this.isShowSongQueue = !this.isShowSongQueue;
  }

  playFromQueue(idx: number) {
    if (idx !== this.currSongIdx) {
      this.appService.setQueueIdx(idx);
      this.playAudio();
    } else {
      this.playAudio();
    }
  }

  pauseFromQueue() {
    this.pauseAudio();
  }

  removeAllSongInQueue() {
    this.appService.setCurrentTime(0);
    this.appService.setSongQueue([]);
    this.appService.setQueueIdx(0);
    this.appService.setPlayState(false);
  }

  public get typeOfLoop(): typeof LoopType {
    return LoopType;
  }

  likeTrack(song: Song, idx: number) {
    this.userService.likeTrack(song.id).subscribe(resp => {
      if (resp.success) {
        this.trackService.getUserTrackInfo(song.uploader.username, song.code).subscribe(r => {
          if (r.success) {
            this.userTrackInfo[idx] = r.data;
            if (idx == this.currSongIdx) this.currentUserTrackInfo = r.data;
          }
        });
      }
    });
  }

  likeCurrentTrack(song: Song) {
    this.userService.likeTrack(song.id).subscribe(resp => {
      if (resp.success) {
        this.trackService.getUserTrackInfo(song.uploader.username, song.code).subscribe(r => {
          if (r.success) {
            this.currentUserTrackInfo = r.data;
            this.userTrackInfo[this.currSongIdx] = r.data;
          }
        });
      }
    });
  }
}
