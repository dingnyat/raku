import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {faCamera, faCompactDisc, faLock, faTimes} from "@fortawesome/free-solid-svg-icons";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSelect} from "@angular/material/select";
import {Observable, of, ReplaySubject, Subject} from "rxjs";
import {FormControl} from "@angular/forms";
import {Genre} from "../../../model/Genre";
import {Track} from "../../../model/track";
import * as mm from "music-metadata-browser";
import {AppSettings} from "../../../global/app-settings";
import {AppService} from "../../../service/app.service";
import {GenreService} from "../../../service/genre.service";
import {TrackService} from "../../../service/track.service";
import {take, takeUntil} from "rxjs/operators";

@Component({
  selector: 'update-track-dialog',
  templateUrl: './update-track-dialog.component.html',
  styleUrls: ['./update-track-dialog.component.css']
})
export class UpdateTrackDialogComponent implements OnInit {
  faTimes = faTimes;
  faLock = faLock;
  faCompactDisc = faCompactDisc;
  faCamera = faCamera;

  @ViewChild('FileChooserInput') FileChooserInput: ElementRef;
  @ViewChild('GenresSelect') GenresSelect: MatSelect;
  @ViewChild('UploadImageInp') UploadImageInp: ElementRef;
  @ViewChild('ImageAudio') ImageAudio: ElementRef;

  protected _onDestroy = new Subject<void>();

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

  constructor(public dialogRef: MatDialogRef<UpdateTrackDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private appService: AppService,
              private genreService: GenreService,
              private trackService: TrackService,) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.title = this.data.track.title;
    this.code = this.data.track.code;
    this.link = AppSettings.BASE_URL + "/" + this.appService.getCurrentUser().username + "/";
    this.artist = this.data.track.artist;
    this.composer = this.data.track.composer;
    this.description = this.data.track.description;
    this.privacyCtrl = new FormControl(this.data.track.privacy.toLowerCase().substr(1));

    this.tagsNgModel = [];
    this.data.track.tags.forEach(value => {
      this.tagsNgModel.push({display: value, value: value});
    })

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
    this.genresControl.setValue(this.data.track.genres);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  public transform(value: string): Observable<string> {
    const item = `#${value}`;
    return of(item);
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

  cancel() {
    this.dialogRef.close();
  }

  update() {
    let formData = new FormData();
    formData.append("id", this.data.track.id);
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
    if (this.image != null) {
      // @ts-ignore
      formData.append("cropData", JSON.stringify($(this.ImageAudio.nativeElement).guillotine("getData")));
      formData.append("image", this.image);
    }
    this.trackService.update(formData).subscribe(data => {
      if (data.success) {
        this.dialogRef.close(data);
      }
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
