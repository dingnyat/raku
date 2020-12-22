import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {AppSettings} from "../../global/app-settings";

@Component({
  selector: 'app-user-security',
  templateUrl: './user-security.component.html',
  styleUrls: ['./user-security.component.css']
})
export class UserSecurityComponent implements OnInit {
  faTimes = faTimes;
  user: any = {};
  link = AppSettings.BASE_URL + "/";

  usernameExisted = false;
  sentEmail = false;
  changeUsername = true;

  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<UserSecurityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.userService.getMyAllInfo().subscribe(resp => {
      if (resp.success) {
        this.user = resp.data;
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  update() {

  }

  onChangeUsername() {
    this.userService.checkExistedUsername(this.user.username).subscribe(resp => {
      this.usernameExisted = resp.success;
    });
  }

  sendPasswordResetLink() {
    this.userService.sendPasswordResetLink().subscribe(resp => {
      if (resp.success) {
        this.sentEmail = true;
      }
    });
  }

  clickChangeUsername() {
    if (this.changeUsername) {
      this.changeUsername = !this.changeUsername;
    } else {
      if (!this.usernameExisted) {
        this.userService.changeUsername(this.user.username).subscribe(resp => {
          if (resp.success) {
            this.changeUsername = true;
          }
        });
      }
    }
  }
}
