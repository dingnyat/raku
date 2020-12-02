import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Song} from "../../model/Song";
import {Title} from "@angular/platform-browser";
import * as moment from "moment";
import {AppSettings} from "../../global/app-settings";
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import {faDownload, faLock, faPen} from "@fortawesome/free-solid-svg-icons";
import {TrackService} from "../../service/track.service";

@Component({
  selector: 'app-your-tracks',
  templateUrl: './your-tracks.component.html',
  styleUrls: ['./your-tracks.component.css']
})
export class YourTracksComponent implements OnInit {

  tracks: Song[] = [];
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faDownload = faDownload;
  faLock = faLock;

  constructor(private userService: UserService, private title: Title, private trackService: TrackService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Your tracks on Raku");
    this.reloadData();
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  deleteTrack(track: Song) {
    if (confirm("Do you want to delete forever this track: " + track.title)) {
      this.trackService.deleteTrack(track).subscribe(resp => {
        if (resp.success) {
          this.reloadData();
        }
      });
    }
  }

  reloadData() {
    this.userService.getYourTrack().subscribe(resp => {
      if (resp.success) {
        this.tracks = resp.data as Song[];
        this.tracks.forEach(track => {
          track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
          track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;
          track.link = "/" + track.uploader.username + "/" + track.code;
        });
      }
    })
  }
}
