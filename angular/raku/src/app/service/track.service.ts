import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends BaseService {

  constructor() {
    super();
    this.contextUrl = "/api/track";
  }

  upload(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/upload", formData);
  }
}
