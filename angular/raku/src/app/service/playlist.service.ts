import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends BaseService {
  constructor() {
    super();
    this.contextUrl = "/api/playlist";
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.BASE_URL + this.contextUrl + "/delete/" + id);
  }

  update(formData: FormData):Observable<any> {
    return this.http.put(this.BASE_URL + this.contextUrl + "/update", formData);
  }

  create(formData: FormData):Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/create", formData);
  }
}
