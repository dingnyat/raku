import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {Song} from "../model/Song";
import {UserPrincipal} from "../model/UserPrincipal";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private songsSub = new Subject<Song[]>();

  songsObs = this.songsSub.asObservable();

  private playState = new Subject<boolean>();

  playStateObs = this.playState.asObservable();

  private currUser = new BehaviorSubject(null);

  userObs = this.currUser.asObservable();

  constructor() {
  }

  removeAll() {
    this.songsSub.next([]);
  }

  setSongs(songs: Song[]) {
    this.songsSub.next(songs);
  }

  setPlayState(state: boolean) {
    this.playState.next(state);
  }

  setUser(user: UserPrincipal) {
    this.currUser.next(user);
  }

  getCurrentUser() {
    return this.currUser.getValue();
  }
}
