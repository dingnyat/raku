import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {faCamera, faCompactDisc, faLock} from "@fortawesome/free-solid-svg-icons";
import {FormControl} from "@angular/forms";
import {Genre} from "../../model/Genre";
import {Observable, of, ReplaySubject, Subject} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {GenreService} from "../../service/genre.service";
import {TrackService} from "../../service/track.service";
import {AppService} from "../../service/app.service";
import {take, takeUntil} from "rxjs/operators";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Track} from "../../model/track";
import * as mm from 'music-metadata-browser';
import {commonLabels, formatLabels, TagLabel} from './format-tags';
import {AppSettings} from "../../global/app-settings";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload-audio',
  templateUrl: './upload-audio.component.html',
  styleUrls: ['./upload-audio.component.css']
})
export class UploadAudioComponent implements OnInit, OnDestroy {

  @ViewChild('FileChooserInput') FileChooserInput: ElementRef;
  @ViewChild('GenresSelect') GenresSelect: MatSelect;
  @ViewChild('UploadImageInp') UploadImageInp: ElementRef;
  @ViewChild('ImageAudio') ImageAudio: ElementRef;

  protected _onDestroy = new Subject<void>();

  faLock = faLock;
  faCompactDisc = faCompactDisc;
  faCamera = faCamera;

  selectedFile: File = null;
  status: boolean;
  progress: number;
  message: string;
  tempFile: string;

  public results: IFileAnalysis[];
  public tagLists: ITagList[] = [{
    title: 'Format',
    key: 'format'
  }, {
    title: 'Generic tags',
    key: 'common'
  }];
  public nativeTags: { type: string, tags: { id: string, value: string }[] }[] = [];


  imageBase64: string;
  image: File;
  tagsNgModel = [];
  description: string;
  title: string;
  link: string;
  code: string;
  composer: string;
  artist: string;
  duration: string;
  privacyCtrl: FormControl = new FormControl();
  genres: Genre[];
  genresControl: FormControl = new FormControl();
  genresFilterCtrl: FormControl = new FormControl();
  filteredGenres: ReplaySubject<Genre[]>;

  resultTrack: Track;

  constructor(private genreService: GenreService,
              private trackService: TrackService,
              public appService: AppService,
              private zone: NgZone,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openFileChooser() {
    const e: HTMLElement = this.FileChooserInput.nativeElement;
    e.click();
  }

  async handleFilesInput(event) {
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      this.results = [];
      await this.parseFile(this.selectedFile);

      this.status = false;
      this.progress = 0;
      this.message = "";

      this.privacyCtrl = new FormControl("public");
      this.description = "";
      this.link = AppSettings.BASE_URL + "/" + this.appService.getCurrentUser().username + "/";
      this.tagsNgModel = [];

      this.genresControl = new FormControl();
      this.genresFilterCtrl = new FormControl();
      this.filteredGenres = new ReplaySubject<Genre[]>(1);
      this.genresFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterGenres();
        });
      this.genreService.getAll().subscribe(data => {
        this.genres = data.data as Genre[];
        this.genresFilterCtrl.setValue("");
      });
      this.filteredGenres
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(() => {
          this.GenresSelect.compareWith = (a: Genre, b: Genre) => a && b && a.code === b.code;
        });
      this.uploadAudio();
    }
  }

  private parseFile(file: File): Promise<void> {
    const t0 = new Date().getTime();
    const result: IFileAnalysis = {
      file
    };
    this.results.push(result);
    return mm.parseBlob(file).then(metadata => {
      const t1 = new Date().getTime();
      const duration = t1 - t0;
      this.zone.run(() => {
        result.metadata = metadata;
        this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
        this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
        this.nativeTags = this.prepareNativeTags(metadata.native);
        console.log(result.metadata);
        this.title = result.metadata?.common?.title ? result.metadata.common.title : file.name.replace(/\.[^/.]+$/, "");
        this.code = this.handleTrackCode(this.title);
        this.artist = result.metadata.common?.artist ? result.metadata.common.artist : "";
        this.composer = result.metadata.common?.composer ? result.metadata.common.composer[0] : "";
        this.duration = new Date(result.metadata.format.duration * 1000).toISOString().substr(11, 8);
        if (this.duration.substr(0, 2) == '00') {
          this.duration = this.duration.substr(3, 5);
        }
      });
    }).catch(err => {
      this.zone.run<void>(() => {
        result.parseError = err.message;
      });
    });
  }

  private prepareTags(labels: TagLabel[], tags): ITagText[] {
    return labels.filter(label => tags.hasOwnProperty(label.key)).map(label => {
        const av = Array.isArray(tags[label.key]) ? tags[label.key] : [tags[label.key]];
        return {
          key: label.key,
          label: {text: label.label, ref: label.keyRef},
          value: av.map(v => {
            return {
              text: label.toText ? label.toText(v) : v,
              ref: label.valueRef ? label.valueRef(v) : undefined
            };
          })
        };
      }
    );
  }

  private prepareNativeTags(tags): { type: string, tags: { id: string, value: string }[] }[] {
    return Object.keys(tags).map(type => {
      return {
        type,
        tags: tags[type]
      };
    });
  }

  uploadAudio() {
    this.trackService.uploadAudio(this.selectedFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        if (event.body.success == true) {
          this.tempFile = event.body.data;
        } else {
        }
      }
    }, error => {
      console.log(error);
      this.progress = 0;
      this.message = 'Could not upload the file: ' + this.selectedFile.name;
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

  handleUploadImage(event) {
    if (event.target.files[0]) {
      this.image = event.target.files[0];
    }
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
      $(this.ImageAudio.nativeElement).guillotine({width: 260, height: 260, init: {scale: 0.3}});
    }, 20);
  }

  handleTrackCode(title: string): string {
    title = this.removeVietnameseTones(title.toLowerCase().trim());
    // remove special characters (uncomplete)
    title = title.replace(/’|!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g, "").trim();
    title = title.replace(/\s+/g, "-");
    title = title.replace(/[-]+/g, "-");
    return title;
  }

  removeVietnameseTones(str): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    return str;
  }

  public transform(value: string): Observable<string> {
    const item = `#${value}`;
    return of(item);
  }

  save() {
    let formData = new FormData();
    formData.append("tempAudioName", this.tempFile);
    formData.append("title", this.title);
    formData.append("code", this.code);
    formData.append("description", this.description);
    formData.append("privacy", this.privacyCtrl.value);

    let tags = [];
    this.tagsNgModel.forEach(tag => {
      tags.push(tag.display);
    });
    formData.append("tags", JSON.stringify(tags));

    formData.append("genres", JSON.stringify(this.genresControl.value));
    formData.append("composer", this.composer);
    formData.append("artist", this.artist);
    formData.append("duration", this.duration);
    if (this.image != null) {
      // @ts-ignore
      formData.append("cropData", JSON.stringify($(this.ImageAudio.nativeElement).guillotine("getData")));
      formData.append("image", this.image);
    }
    this.trackService.create(formData).subscribe(data => {
      if (data.success) {
        this.status = true;
        this.resultTrack = data.data as Track;
        this.resultTrack.src = AppSettings.ENDPOINT + "/" + this.resultTrack.uploader.username + "/audio/" + this.resultTrack.code;
        this.resultTrack.link = AppSettings.BASE_URL + "/" + this.resultTrack.uploader.username + "/" + this.resultTrack.code;
        this.resultTrack.imageUrl = AppSettings.ENDPOINT + "/" + this.resultTrack.uploader.username + "/image/" + this.resultTrack.imageUrl;
        console.log(this.resultTrack);
      }
    });
  }

  cancel() {
    let res = confirm("Do you want to cancel upload audio: " + this.selectedFile.name + "?");
    if (res) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/upload']);
      });
    }
  }

  back() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/upload']);
    });
  }
}

interface IValue {
  text: string;
  ref?: string;
}

interface ITagText {
  key: string;
  label: IValue;
  value: IValue[];
}

interface IUrlAsFile {
  name: string;
  type: string;
}

interface IFileAnalysis {
  file: File | IUrlAsFile;
  metadata?: mm.IAudioMetadata;
  parseError?: Error;
}

interface ITagList {
  title: string;
  key: string;
  tags?: ITagText[];
}
