import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Song} from "../../model/Song";
import {Title} from "@angular/platform-browser";
import * as moment from "moment";
import {AppSettings} from "../../global/app-settings";
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import {faDownload, faLock, faPen} from "@fortawesome/free-solid-svg-icons";
import {TrackService} from "../../service/track.service";
import {MatDialog} from "@angular/material/dialog";
import {UpdateTrackDialogComponent} from "./update-track-dialog/update-track-dialog.component";
import {ToastrService} from "ngx-toastr";

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

  constructor(private userService: UserService,
              private title: Title,
              private trackService: TrackService,
              public dialog: MatDialog,
              private toastr: ToastrService) {
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
          this.toastr.success("Deleted the track successfully!")
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

  updateTrack(track: Song) {
    const dialogRef = this.dialog.open(UpdateTrackDialogComponent, {
      width: "900px",
      height: "auto",
      disableClose: true,
      data: {track: track}
    });

    dialogRef.afterClosed().subscribe(res => {
       if (res.success) {
         this.toastr.success("Updated the track successfully!");
         this.reloadData();
       }
    })
  }
}
