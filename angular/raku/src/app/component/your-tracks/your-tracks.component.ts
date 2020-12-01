import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Song} from "../../model/Song";

@Component({
  selector: 'app-your-tracks',
  templateUrl: './your-tracks.component.html',
  styleUrls: ['./your-tracks.component.css']
})
export class YourTracksComponent implements OnInit {

  tracks: Song[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getYourTrack().subscribe(tracks => {
      this.tracks = tracks;
    })
  }

}
