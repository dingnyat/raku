import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../../../model/comment";
import {UserPrincipal} from "../../../model/UserPrincipal";
import {faReply} from "@fortawesome/free-solid-svg-icons";

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
  faReply = faReply;

  showReply = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  reply() {

  }
}
