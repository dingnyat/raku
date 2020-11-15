import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {FileUploadService} from "../../../service/file-upload.service";
import {FormControl} from "@angular/forms";
import {Observable, of, ReplaySubject, Subject} from "rxjs";
import {Genre} from "../../../model/Genre";
import {MatSelect} from "@angular/material/select";
import {take, takeUntil} from "rxjs/operators";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {GenreService} from "../../../service/genre.service";
import {TrackService} from "../../../service/track.service";

@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input("sourceFile")
  file: File;

  @ViewChild('UploadImageInp') UploadImageInp: ElementRef;

  @ViewChild('ImageAudio') ImageAudio: ElementRef;

  progress: number;
  message: string;

  genres: Genre[];
  genresControl: FormControl;
  genresFilterCtrl: FormControl;
  filteredGenres: ReplaySubject<Genre[]>;

  @ViewChild('genresSelect', {static: true}) genresSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  faCamera = faCamera;

  tags: string[];

  image: File;
  imageBase64: string;

  privacyCtrl: FormControl;
  description: string;
  title: string;
  code: string;
  src: string;

  constructor(private fileUploadService: FileUploadService, private genreService: GenreService, private trackService: TrackService) {
  }

  ngOnInit(): void {
    this.progress = 0;
    this.message = "";
    this.title = this.file.name.replace(/\.[^/.]+$/, "");
    this.code = UploadFormComponent.handleSongCode(this.title);
    this.privacyCtrl = new FormControl("public");
    this.description = "";
    this.tags = [];

    this.genresControl = new FormControl();
    this.genresFilterCtrl = new FormControl();
    this.filteredGenres = new ReplaySubject<Genre[]>(1);
    this.genresFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterGenres();
      });
    this.setInitialValue();

    this.genreService.getAll().subscribe(data => {
      this.genres = data.data as Genre[];
      this.genresFilterCtrl.setValue("");
    });
  }

  ngAfterViewInit(): void {
    this.uploadFile();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  uploadFile() {
    this.fileUploadService.uploadFile(this.file).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        if (event.body.success == true) {
          this.src = event.body.data;
        } else {

        }
      }
    }, error => {
      console.log(error);
      this.progress = 0;
      this.message = 'Could not upload the file: ' + this.file.name;
    });
  }

  protected setInitialValue() {
    this.filteredGenres
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.genresSelect.compareWith = (a: Genre, b: Genre) => a && b && a.code === b.code;
      });
  }

  protected filterGenres() {
    if (!this.genres) {
      return;
    }

    let search = this.genresFilterCtrl.value;
    if (!search) {
      this.filteredGenres.next(this.genres.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredGenres.next(
      this.genres.filter(genre => genre.name.toLowerCase().indexOf(search) > -1)
    );
  }

  openUploadImage() {
    const e: HTMLElement = this.UploadImageInp.nativeElement;
    e.click();
  }

  static handleSongCode(title: string): string {
    title = title.toLowerCase().trim();

    // remove special characters (uncomplete)
    title = title.replace(/['().\[\]]/g, "");

    title = title.replace(/\s+/g, "-");
    title = title.replace(/[-]+/g, "-");
    return title;
  }

  public transform(value: string): Observable<object> {
    const item = {display: `#${value}`, value: `#${value}`};
    return of(item);
  }

  handleUploadImage(event) {
    this.image = event.target.files[0];
    if (this.image) {
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.image);
    }
  }

  _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    setTimeout(() => {
      // @ts-ignore
      $(this.ImageAudio.nativeElement).guillotine({width: 200, heigth: 200, init: {scale: 0.3}});
    }, 20);
  }

  save() {
    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("code", this.code);
    formData.append("src", this.src);
    formData.append("description", this.description);
    formData.append("privacy", this.privacyCtrl.value);
    formData.append("tags", JSON.stringify(this.tags));
    formData.append("genresStr", JSON.stringify(this.genresControl.value));
    if (this.image != null) {
      // @ts-ignore
      formData.append("imageData", JSON.stringify($(this.ImageAudio.nativeElement).guillotine("getData")));
      formData.append("image", this.image);
    }
    this.trackService.upload(formData).subscribe(data => {
      console.log(data);
    });
  }

  cancel() {
    let res = confirm("Do you want to cancel upload audio: " + this.file.name + "?");
    if (res) {
    }
  }
}
