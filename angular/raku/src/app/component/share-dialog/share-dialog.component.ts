import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as moment from "moment";
import {AppSettings} from "../../global/app-settings";

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {

  shareLink: string;

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.shareLink = (AppSettings.BASE_URL + this.data.track.link).trim();
    console.log(this.data.track);
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  encodeUrl(url) {
    return encodeURIComponent(url);
  }
}
