import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GenreService extends BaseService {

  constructor() {
    super();
    this.contextUrl = "/api/genre";
  }

  getAll(): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + '/get-all');
  }

  getByCode(code: string): Observable<any> {
    return this.http.get(this.BASE_URL + this.contextUrl + '/get-by-code/' + code);

  }
}
