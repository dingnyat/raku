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

  repostTrack(id: number): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/repost-track", {params: {track: id.toString()}});
  }

  followUser(username: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/follow-user", {params: {username: username}});
  }

  comment(data: Object): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/comment", data);
  }

  getUserStats(username): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-user-stats", {params: {username: username}});
  }

  getAuthenticatedUserHistoryTracks(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-history-tracks");
  }

  getYourTrack(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-your-tracks");
  }

  deleteComment(cmt): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/delete-comment/" + cmt.id);
  }

  getMyPlaylist(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/my-playlist");
  }

  addTrackToPlaylist(trackId: number, playlistId: number): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/add-to-playlist", {
      'params': {
        'trackId': trackId.toString(),
        'playlistId': playlistId.toString()
      }
    });
  }

  removeFromPlaylist(trackId: number, playlistId: number): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/remove-from-playlist", {
      'params': {
        'trackId': trackId.toString(),
        'playlistId': playlistId.toString()
      }
    });
  }

  createAPlaylist(data): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/create-playlist", data);
  }

  getMyAllInfo(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/my-all-info");
  }

  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/update-profile", formData);
  }
}
