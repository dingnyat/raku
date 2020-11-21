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

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.currSongObs.subscribe(song => {
      this.currentAudio = [song];
      if (this.isPlaying) {
        this.playAudio();
      }
    });
    this.appService.songQueueObs.subscribe(songQueue => {
      this.songQueue = songQueue;
    });
    this.appService.queueIdxObs.subscribe(idx => {
      this.currSongIdx = idx;
      this.appService.setCurrentSong(this.songQueue[this.currSongIdx]);
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
    this.appService.setSongQueue([]);
  }

  public get typeOfLoop(): typeof LoopType {
    return LoopType;
  }
}
