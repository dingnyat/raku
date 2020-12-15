import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Comment} from "../../../model/comment";
import {User} from "../../../model/user";
import {faReply, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../../service/user.service";
import * as moment from 'moment';
import {SignInUpFormComponent} from "../../top-menu/sign-in-up-form/sign-in-up-form.component";
import {AppService} from "../../../service/app.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'commentor',
  templateUrl: './commentor.component.html',
  styleUrls: ['./commentor.component.css']
})
export class CommentorComponent implements OnInit {

  @Input("comment")
  cmt: Comment;

  @Input("cur-user")
  user: User;

  @Output("reloadComment")
  reloadComment = new EventEmitter<any>();

  @ViewChild("ReplyInput")
  ReplyInput: ElementRef;

  faReply = faReply;

  showReply = false;
  faTrashAlt = faTrashAlt;

  constructor(private userService: UserService, private appService: AppService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  comment(event) {
    if (this.appService.getCurrentUser() != null) {
      if (event.target.value != null && event.target.value.trim() != '') {
        this.userService.comment({replyCommentId: this.cmt.id, content: event.target.value}).subscribe(resp => {
          if (resp.success) {
            event.target.value = '';
            this.showReply = false;
            this.reload();
          }
        });
      }
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

  displayReply() {
    this.showReply = true;
    setTimeout(() => {
      this.ReplyInput.nativeElement.focus();
    }, 20);
  }

  reload() {
    this.reloadComment.emit(true);
  }

  convertTimespan(time: Date) {
    return moment(time).startOf("second").fromNow();
  }

  delete(cmt: Comment) {
    if (confirm("Do you want to delete the comment?")) {
      this.userService.deleteComment(cmt).subscribe(resp => {
        this.reload();
      });
    }
  }
}
