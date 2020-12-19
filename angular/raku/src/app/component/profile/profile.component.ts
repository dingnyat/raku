import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {ActivatedRoute} from "@angular/router";
import {
  faHeadphones,
  faHeart,
  faList,
  faPencilAlt,
  faPlay,
  faShare,
  faStar,
  faThumbtack,
  faUserCheck,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {AppService} from "../../service/app.service";
import {UserStats} from "../../model/user-stats";
import {Title} from "@angular/platform-browser";
import {TrackService} from "../../service/track.service";
import {Track} from "../../model/track";
import {AppSettings} from "../../global/app-settings";
import * as moment from "moment";
import {ShareDialogComponent} from "../share-dialog/share-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AddToPlaylistComponent} from "../add-to-playlist/add-to-playlist.component";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import {ToastrService} from "ngx-toastr";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";
import {Playlist} from "../../model/playlist";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faUserPlus = faUserPlus;
  faUserCheck = faUserCheck;
  faStar = faStar;
  faPlay = faPlay;
  faHeart = faHeart;
  faThumbtack = faThumbtack;
  faShare = faShare;
  faList = faList;

  user: User;
  currUser: User;
  userStats: UserStats;
  tracks: Track[] = [];
  repostTracks: Track[] = [];
  playlists: Playlist[] = [];
  faHeadphone = faHeadphones;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private appService: AppService,
              private title: Title,
              private trackService: TrackService,
              public dialog: MatDialog,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.currUser = this.appService.getCurrentUser();
    this.appService.userObs.subscribe(u => {
      this.currUser = u;
    })
    this.route.params.subscribe(params => {
      this.userService.getByUsername(params.username).subscribe(resp => {
        if (resp.success) {
          this.user = resp.data;
          if (this.user.imageUrl) {
            this.user.imageUrl = this.user.imageUrl + "?v=" + (new Date()).toISOString();
          }
          this.title.setTitle(this.user.name + "'s profile | Raku");
          this.userService.getUserStats(this.user.username).subscribe(r => {
            if (r.success) {
              this.userStats = r.data;
            }
          });
          this.trackService.getTracksOf(this.user.username).subscribe(r => {
            if (r.success) {
              this.tracks = r.data;
              this.tracks.forEach(track => {
                track.link = "/" + track.uploader.username + "/" + track.code;
                track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
                track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;

                this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(info => {
                  if (info.success) {
                    track['userTrackInfo'] = info.data;
                  }
                });
              })
            }
          });
          this.trackService.getRepostTracksOf(this.user.username).subscribe(r => {
            if (r.success) {
              this.repostTracks = r.data;
              this.repostTracks.forEach(track => {
                track.link = "/" + track.uploader.username + "/" + track.code;
                track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
                track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;

                this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(info => {
                  if (info.success) {
                    track['userTrackInfo'] = info.data;
                  }
                });
              })
            }
          });

          this.trackService.getPlaylistsOf(this.user.username).subscribe(r => {
            if (r.success) {
              this.playlists = r.data;
              this.playlists.forEach(playlist => {
                playlist.tracks.forEach(track => {
                  track.link = "/" + track.uploader.username + "/" + track.code;
                  track.imageUrl = track.imageUrl ? (AppSettings.ENDPOINT + "/" + track.uploader.username + "/image/" + track.imageUrl) : null;
                  track.src = AppSettings.ENDPOINT + "/" + track.uploader.username + "/audio/" + track.code;
                })
              })
            }
          });
        }
      });
    });
  }

  followUser() {
    if (this.appService.getCurrentUser() != null) {
      this.userService.followUser(this.user.username).subscribe(resp => {
        if (resp.success) {
          this.userService.getUserStats(this.user.username).subscribe(r => {
            if (r.success) {
              this.userStats = r.data;
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  playTrack(track: Track) {

  }

  likeTrack(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.likeTrack(track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(r => {
            if (r.success) {
              track['userTrackInfo'] = r.data;
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  repostTrack(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.repostTrack(track.id).subscribe(resp => {
        if (resp.success) {
          this.trackService.getUserTrackInfo(track.uploader.username, track.code).subscribe(r => {
            if (r.success) {
              track['userTrackInfo'] = r.data;
            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  showShareDialog(track: Track) {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: "500px",
      height: "auto",
      data: {track: track}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    })
  }

  addToPlaylist(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      const dialogRef = this.dialog.open(AddToPlaylistComponent, {
        width: "500px",
        height: "auto",
        data: {track: track}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    } else {
      const dialogRef = this.dialog.open(SignInUpFormComponent, {
        width: "900px",
        height: "auto",
        disableClose: true,
        data: {success: false, type: 'signin'}
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

  showEditProfileDialog() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: "900px",
      height: "auto",
      data: null
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res.success) {
        this.toastr.success("Updated user's profile successfully!");
        this.ngOnInit();
      }
    })
  }

  playPlaylist(playlist: Playlist) {
    this.appService.setTrackQueue(playlist.tracks);
    this.appService.setQueueIdx(0);
    this.appService.setPlayState(true);
  }
}
