import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor() {
    super();
    this.contextUrl = "/api/user";
  }

  getByUsername(username): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/" + username);
  }

  likeTrack(trackId: number): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/like-track", {params: {track: trackId.toString()}});
  }
}
