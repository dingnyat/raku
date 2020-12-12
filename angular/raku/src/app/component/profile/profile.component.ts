import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {ActivatedRoute} from "@angular/router";
import {faPencilAlt, faStar, faUserCheck, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {AppService} from "../../service/app.service";
import {UserStats} from "../../model/user-stats";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  faStar = faStar;
  currUser: User;
  faUserPlus = faUserPlus;
  faUserCheck = faUserCheck;
  userStats: UserStats;
  faPencilAlt = faPencilAlt;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private appService: AppService,
              private title: Title) {
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
          this.title.setTitle(this.user.name + "'s profile | Raku")
          this.userService.getUserStats(this.user.username).subscribe(r => {
            if (r.success) {
              this.userStats = r.data;
              console.log(this.userStats);
            }
          })
        }
      });
    });
  }

  followUser() {
    this.userService.followUser(this.user.username).subscribe(resp => {
      if (resp.success) {
        this.userService.getUserStats(this.user.username).subscribe(r => {
          if (r.success) {
            this.userStats = r.data;
          }
        });
      }
    });
  }
}
