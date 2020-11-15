import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
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

  @Input("songQueue")
  songQueue: any[];

  @Output("songQueueChange")
  songQueueChange = new EventEmitter<any[]>();

  currSongIdx: number;

  @ViewChild(PlyrComponent, {static: true})
  plyr: PlyrComponent;
  player: Plyr;

  isPlaying = false;

  currentAudio: any[];

  isShowSongQueue: boolean;

  loopType: number;

  constructor(private songApp: AppService) {
    songApp.playStateObs.subscribe(state => {
      this.isPlaying = state;
      if (this.isPlaying) {
        this.playAudio();
      } else {
        this.pauseAudio();
      }
    })
  }

  ngOnInit(): void {
    this.currSongIdx = 0;
    this.currentAudio = [this.songQueue[this.currSongIdx]];
    this.isShowSongQueue = false;
    this.loopType = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentAudio = [this.songQueue[this.currSongIdx]];
    if (this.songQueue.length == 0) {
    }
    if (this.isPlaying) {
      setTimeout(() => {
        this.player.play();
      }, 1000);
    }
  }

  onInitPlayer($event: any) {
    this.player = $event;
  }

  playAudio() {
    if (this.player['ready']) {
      this.player.play();
    }
  }

  pauseAudio() {
    this.player.pause();
  }

  onPauseAudio() {
    this.isPlaying = false;
  }

  onPlayAudio() {
    this.isPlaying = true;
  }

  nextAudio() {
    this.currSongIdx = (this.currSongIdx + 1 > this.songQueue.length - 1) ? this.currSongIdx : this.currSongIdx + 1;
    this.currentAudio = [this.songQueue[this.currSongIdx]];
    if (this.isPlaying) {
      setTimeout(() => {
        this.player.play();
      }, 1000);
    }
  }

  previousAudio() {
    this.currSongIdx = (this.currSongIdx - 1 < 0) ? this.currSongIdx : this.currSongIdx - 1;
    this.currentAudio = [this.songQueue[this.currSongIdx]];
    if (this.isPlaying) {
      setTimeout(() => {
        this.player.play();
      }, 1000);
    }
  }

  loopAudio() {
    this.loopType = (this.loopType == 0 ? 1 : (this.loopType == 1 ? 2 : 0));
    this.player.loop = this.loopType == 2;
  }

  onSongEnd() {
    if (this.currSongIdx < this.songQueue.length - 1) {
      this.currSongIdx++;
      this.currentAudio = [this.songQueue[this.currSongIdx]];
      setTimeout(() => {
        this.player.play();
      }, 1000);
    } else {
      if (this.loopType == 1) {
        this.currSongIdx = 0;
        this.currentAudio = [this.songQueue[this.currSongIdx]];
        setTimeout(() => {
          this.player.play();
        }, 2000);
      }
    }
  }

  showSongQueue() {
    this.isShowSongQueue = !this.isShowSongQueue;
  }

  playFromQueue(idx: number) {
    if (idx !== this.currSongIdx) {
      this.currSongIdx = idx;
      this.currentAudio = [this.songQueue[this.currSongIdx]];
      setTimeout(() => {
        this.player.play();
      }, 500);
    } else {
      this.playAudio();
    }
  }

  pauseFromQueue() {
    this.pauseAudio();
  }

  removeAllSongInQueue() {
    this.songQueue = [];
    this.songQueueChange.emit(this.songQueue);
  }
}
