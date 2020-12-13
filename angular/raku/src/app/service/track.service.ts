import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {HttpEvent, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends BaseService {

  constructor() {
    super();
    this.contextUrl = "/api/track";
  }

  uploadAudio(fileToUpload: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    const req = new HttpRequest('POST', this.BASE_URL + this.contextUrl + "/upload-audio", formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/create", formData);
  }

  update(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/update", formData);
  }

  getByCode(username, code): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get", {params: {username: username, code: code}});
  }

  getUserTrackInfo(username, code): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/user-track-info", {
      params: {
        username: username,
        code: code
      }
    });
  }

  getTrackStats(username: string, code: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-track-stats", {
      params: {
        username: username,
        code: code
      }
    });
  }

  deleteTrack(track): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/delete/" + track.id);
  }

  getTracksOf(username: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-tracks/" + username);
  }

  getRepostTracksOf(username: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + "/get-repost-tracks/" + username);

  }
}
