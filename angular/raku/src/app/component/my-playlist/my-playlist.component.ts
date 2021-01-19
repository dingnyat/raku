import {Component, OnInit} from '@angular/core';
import {Playlist} from "../../model/playlist";
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import {faLock, faLockOpen, faPen} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../service/user.service";
import {PlaylistService} from "../../service/playlist.service";
import * as moment from "moment";
import {ToastrService} from "ngx-toastr";
import {UpdateTrackDialogComponent} from "../your-tracks/update-track-dialog/update-track-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PlaylistFormComponent} from "./playlist-form/playlist-form.component";

@Component({
  selector: 'app-my-playlist',
  templateUrl: './my-playlist.component.html',
  styleUrls: ['./my-playlist.component.css']
})
export class MyPlaylistComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faLock = faLock;
  faLockOpen = faLockOpen;

  playlists: Playlist[];

  constructor(private userService: UserService,
              private playlistService: PlaylistService,
              private toastr: ToastrService,
              public dialog: MatDialog) {
    this.reloadData();
  }

  ngOnInit(): void {
  }

  update(playlist: Playlist) {
    const dialogRef = this.dialog.open(PlaylistFormComponent, {
      width: "900px",
      height: "auto",
      disableClose: true,
      data: {create: false, playlist: playlist}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res.success) {
        this.toastr.success("Updated the playlist successfully!");
        this.reloadData();
      }
    })
  }

  delete(playlist: Playlist) {
    if (confirm("Do you want to delete playlist: " + playlist.title)) {
      this.playlistService.delete(playlist.id).subscribe(resp => {
        if (resp.success) {
          this.toastr.success("Deleted the playlist successfully!");
          this.reloadData();
        }
      });
    }
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  reloadData() {
    this.userService.getMyPlaylist().subscribe(resp => {
      if (resp.success) {
        this.playlists = resp.data;
      }
    })
  }

  showCreatePlaylist() {
    const dialogRef = this.dialog.open(PlaylistFormComponent, {
      width: "900px",
      height: "auto",
      disableClose: true,
      data: {create: true}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res.success) {
        this.toastr.success("Created a new playlist successfully!");
        this.reloadData();
      }
    })
  }
}
