import {Component, Input, OnInit} from '@angular/core';
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {Track} from "../../model/track";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";
import {AppService} from "../../service/app.service";
import {UserService} from "../../service/user.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {

  faHeart = faHeart;

  @Input() target: any;
  @Input() active: boolean = false;

  constructor(private appService: AppService,
              private userService: UserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  clickLike() {
    if (this.target != null) { // check if targer is not track (e.x playlist)
      this.likeTrack(this.target);
    }
  }

  likeTrack(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.likeTrack(track.id).subscribe(resp => {
        if (resp.success) {
          this.active = resp.data;
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
}
