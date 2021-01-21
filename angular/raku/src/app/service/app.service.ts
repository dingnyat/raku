import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Track} from "../model/track";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private trackQueueSub = new BehaviorSubject(null);
  trackQueueObs = this.trackQueueSub.asObservable();

  private queueIdx = new BehaviorSubject(null);
  queueIdxObs = this.queueIdx.asObservable();

  private currTrackSub = new BehaviorSubject(null);
  currTrackObs = this.currTrackSub.asObservable();

  private playState = new BehaviorSubject(false);
  playStateObs = this.playState.asObservable();

  private currTime = new BehaviorSubject(null);
  currTimeObs = this.currTime.asObservable();

  private seekTime = new BehaviorSubject(null);
  seekTimeObs = this.seekTime.asObservable();

  private currUser = new BehaviorSubject(null);
  userObs = this.currUser.asObservable();

  private currPlayData = new BehaviorSubject(null);
  currPlayDataObs = this.currPlayData.asObservable();

  constructor() {
  }

  setTrackQueue(tracks: Track[]) {
    this.trackQueueSub.next(tracks);
  }

  setQueueIdx(idx: number) {
    this.queueIdx.next(idx);
  }

  setCurrentTrack(track: Track) {
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    });
    this.currTrackSub.next(track);
  }

  getCurrentTrack(): Track {
    return this.currTrackSub.getValue();
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

  setSeekTime(time: number) {
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

  getCurrPlayData() {
    return this.currPlayData.getValue();
  }

  setCurrPlayData(data: any) {
    this.currPlayData.next(data);
  }
}
