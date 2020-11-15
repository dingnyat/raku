import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Song} from "./model/Song";
import * as moment from 'moment';
import {AppService} from "./service/app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  currentYear: number;

  songs: Song[];

  constructor(public songApp: AppService) {
    /*this.songs = [{
      albumPhoto: "turn_back_time.jpg",
      audioName: "NhacA-NhacHoa-WayV-TurnBackTime",
      code: "turn-back-time",
      genres: [{code: "24", name: "Nhạc Hoa"}, {code: "14", name: "Châu Á"}],
      title: "Turn Back Time",
      singers: [{code: "64", name: "WayV", description: "Châu Á Nhạc Hoa"}],
      view: 158,
      vip: false,
      type: "",
      src: "http://localhost:8081/audio/NhacA-NhacHoa-WayV-TurnBackTime.mp3"
    }];
    songApp.songsObs.subscribe(songs => {
      this.songs = songs as Song[];
      this.songs.forEach(song => {
        song.src = "http://localhost:8081/audio/" + song.audioName + ".mp3";
      });
      setTimeout(() => {
        this.songApp.setPlayState(true);
      }, 500);
    })*/
  }

  ngOnInit(): void {
    this.currentYear = moment().get('y');
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  songQueueChange($event: any[]) {
    this.songs = $event;
  }
}
