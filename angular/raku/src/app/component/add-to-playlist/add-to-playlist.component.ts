import {Component, Inject, OnInit} from '@angular/core';
import {faMusic} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../service/user.service";
import {Playlist} from "../../model/playlist";
import {User} from "../../model/user";
import {AppService} from "../../service/app.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Track} from "../../model/track";
import {ToastrService} from "ngx-toastr";
import {AppSettings} from "../../global/app-settings";

@Component({
  selector: 'add-to-playlist',
  templateUrl: './add-to-playlist.component.html',
  styleUrls: ['./add-to-playlist.component.css']
})
export class AddToPlaylistComponent implements OnInit {
  faMusic = faMusic;
  playlists: Playlist[] = [];
  user: User;
  track: Track;
  title: string = '';
  privacy: string = "_PUBLIC";
  tabIndex: number = 0;
  link: string;
  code: string;

  constructor(private userService: UserService,
              private appService: AppService,
              public dialogRef: MatDialogRef<AddToPlaylistComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadPlaylists();
    this.user = this.appService.getCurrentUser();
    this.track = this.data.track;
    this.link = AppSettings.BASE_URL + "/" + this.user?.username + "/playlist/";
    // todo load playlists which have this track, if not show button add, else show "x" to remove this track from the playlist
  }

  addToPlaylist(playlist: Playlist) {
    this.userService.addTrackToPlaylist(this.track.id, playlist.id).subscribe(resp => {
      if (resp.success) {
        this.loadPlaylists();
        this.toastr.success("Added to playlist!");
      }
    });
  }

  createAPlaylist() {
    this.userService.createAPlaylist({title: this.title, code: this.code, privacy: this.privacy}).subscribe(resp => {
      if (resp.success) {
        this.loadPlaylists();
        this.tabIndex = 0;
      }
    });
  }

  removeFromPlaylist(playlist: Playlist) {
    this.userService.removeFromPlaylist(this.track.id, playlist.id).subscribe(resp => {
      if (resp.success) {
        this.loadPlaylists();
        this.toastr.success("Removed to playlist!");
      }
    });
  }

  loadPlaylists() {
    this.userService.getMyPlaylist().subscribe(resp => {
      if (resp.success) {
        this.playlists = resp.data as Playlist[];
        this.playlists.forEach(p => {
          p.tracks.forEach(t => {
            if (t.code == this.track.code) {
              p['hasTrack'] = true;
            }
          })
        });
      }
    });
  }

  inputTitle() {
    this.code = this.handleTrackCode(this.title);
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
}
