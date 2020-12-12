import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'create-playlist-dialog',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrls: ['./create-playlist-dialog.component.css']
})
export class CreatePlaylistDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }
}
