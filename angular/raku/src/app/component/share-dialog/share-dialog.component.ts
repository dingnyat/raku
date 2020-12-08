import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as moment from "moment";

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    console.log(this.data.track);
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }
}
