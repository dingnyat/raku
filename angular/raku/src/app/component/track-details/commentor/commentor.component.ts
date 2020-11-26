import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Comment} from "../../../model/comment";
import {UserPrincipal} from "../../../model/UserPrincipal";
import {faReply} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../../service/user.service";
import {TrackService} from "../../../service/track.service";
import * as moment from 'moment';

@Component({
  selector: 'commentor',
  templateUrl: './commentor.component.html',
  styleUrls: ['./commentor.component.css']
})
export class CommentorComponent implements OnInit {

  @Input("comment")
  cmt: Comment;

  @Input("cur-user")
  user: UserPrincipal;

  @Output("reloadComment")
  reloadComment = new EventEmitter<any>();

  @ViewChild("ReplyInput")
  ReplyInput: ElementRef;

  faReply = faReply;

  showReply = false;

  constructor(private userService: UserService, private trackService: TrackService) {
  }

  ngOnInit(): void {
  }

  comment(event) {
    if (event.target.value != null && event.target.value.trim() != '') {
      this.userService.comment({replyCommentId: this.cmt.id, content: event.target.value}).subscribe(resp => {
        if (resp.success) {
          event.target.value = '';
          this.showReply = false;
          this.reload();
        }
      });
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
}
