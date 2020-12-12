import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Song} from "../model/Song";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private songQueueSub = new BehaviorSubject(null);
  songQueueObs = this.songQueueSub.asObservable();

  private queueIdx = new BehaviorSubject(null);
  queueIdxObs = this.queueIdx.asObservable();

  private currSongSub = new BehaviorSubject(null);
  currSongObs = this.currSongSub.asObservable();

  private playState = new BehaviorSubject(false);
  playStateObs = this.playState.asObservable();

  private currTime = new BehaviorSubject(null);
  currTimeObs = this.currTime.asObservable();

  private seekTime = new BehaviorSubject(null);
  seekTimeObs = this.seekTime.asObservable();

  private currUser = new BehaviorSubject(null);
  userObs = this.currUser.asObservable();

  constructor() {
  }

  setSongQueue(songs: Song[]) {
    this.songQueueSub.next(songs);
  }

  setQueueIdx(idx: number) {
    this.queueIdx.next(idx);
  }

  setCurrentSong(song: Song) {
    this.currSongSub.next(song);
  }

  getCurrentSong(): Song {
    return this.currSongSub.getValue();
  }


  setPlayState(state: boolean) {
    this.playState.next(state);
  }

  getPlayState(): boolean {
    return this.playState.getValue();
  }

  setCurrentTime(time: number) {
    this.currTime.next(time);
  }

  setSeekTime(time: number){
    this.seekTime.next(time);
  }

  setUser(user: User) {
    if (user) {
      localStorage.setItem("current-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("current-user");
    }
    this.currUser.next(user);
  }

  getCurrentUser() {
    return this.currUser.getValue();
  }
}
