import {Injectable} from '@angular/core';
import {AppSettings} from "../global/app-settings";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../app.module";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  BASE_URL = AppSettings.ENDPOINT;
  contextUrl = '';

  protected http: HttpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor() {
  }

  search(data): Observable<any> {
    return this.http.post(this.BASE_URL + this.contextUrl + "/search", data);
  }
}
