import {Component, Input, OnInit} from '@angular/core';
import {faThumbtack} from "@fortawesome/free-solid-svg-icons";
import {SignInUpFormComponent} from "../top-menu/sign-in-up-form/sign-in-up-form.component";
import {AppService} from "../../service/app.service";
import {UserService} from "../../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {Track} from "../../model/track";

@Component({
  selector: 'repost-button',
  templateUrl: './repost-button.component.html',
  styleUrls: ['./repost-button.component.css']
})
export class RepostButtonComponent implements OnInit {
  faThumbtack = faThumbtack;

  @Input() active: boolean = false;
  @Input() target: any;

  constructor(private appService: AppService,
              private userService: UserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  clickRepost() {
    if (this.target != null) { // check if targer is not track (e.x playlist)
      this.repostTrack(this.target);
    }
  }

  repostTrack(track: Track) {
    if (this.appService.getCurrentUser() != null) {
      this.userService.repostTrack(track.id).subscribe(resp => {
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
