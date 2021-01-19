import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {faCamera, faCompactDisc, faLock, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FormControl} from "@angular/forms";
import {AppSettings} from "../../../global/app-settings";
import {AppService} from "../../../service/app.service";
import {PlaylistService} from "../../../service/playlist.service";

@Component({
  selector: 'playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.css']
})
export class PlaylistFormComponent implements OnInit {
  faTimes = faTimes;
  faLock = faLock;
  faCompactDisc = faCompactDisc;
  faCamera = faCamera;

  @ViewChild('FileChooserInput') FileChooserInput: ElementRef;
  @ViewChild('UploadImageInp') UploadImageInp: ElementRef;
  @ViewChild('ImageAudio') ImageAudio: ElementRef;

  imageBase64: string;
  image: File;
  title: string;
  link: string;
  code: string;
  privacyCtrl: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<PlaylistFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private appService: AppService,
              private playlistService: PlaylistService) {
    this.link = AppSettings.BASE_URL + "/" + this.appService.getCurrentUser().username + "/playlist/";
    this.privacyCtrl = new FormControl("_PUBLIC");
    if (!data.create) {
      this.privacyCtrl = new FormControl(this.data.playlist.privacy);
      this.title = this.data.playlist.title;
      this.code = this.data.playlist.code;
    }
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close({success: false});
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

  cancel() {
    this.closeDialog();
  }

  submit() {
    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("code", this.code);
    formData.append("privacy", this.privacyCtrl.value);
    if (this.image != null) {
      // @ts-ignore
      formData.append("cropData", JSON.stringify($(this.ImageAudio.nativeElement).guillotine("getData")));
      formData.append("image", this.image);
    }
    if (this.data.create) {
      this.playlistService.create(formData).subscribe(data => {
        if (data.success) {
          this.dialogRef.close(data);
        }
      });
    } else {
      formData.append("id", this.data.playlist.id);
      this.playlistService.update(formData).subscribe(data => {
        if (data.success) {
          this.dialogRef.close(data);
        }
      });
    }
  }

  onChangeTitle() {
    if (this.data.create) {
      this.code = this.handleCode(this.title);
    }
  }

  handleCode(title: string): string {
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

}
