import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpEvent, HttpRequest} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends BaseService {

  constructor() {
    super();
    this.contextUrl = "/api/file";
  }

  uploadFile(fileToUpload: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    const req = new HttpRequest('POST', this.BASE_URL + this.contextUrl + "/upload", formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
