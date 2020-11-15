import {Injectable} from '@angular/core';
import {AppSettings} from "../global/app-settings";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../app.module";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  BASE_URL = AppSettings.ENDPOINT;
  contextUrl = '';

  protected http: HttpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor() {
  }
}
