import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AppService} from "./service/app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  currentYear: number;
  showMediaPlayer: boolean;

  constructor(public songApp: AppService) {
    songApp.songQueueObs.subscribe(songQueue => {
      this.showMediaPlayer = !(songQueue == null || songQueue?.length == 0);
    });

    songApp.setSongQueue([{
      artist: "Versio",
      code: "electro-pop-versio-feel-it-ft-nar",
      composer: "",
      description: "jljl",
      duration: "03:51",
      ext: ".mp3",
      id: 66,
      plays: 0,
      privacy: "_PRIVATE",
      uploader: {name: "nhat do", username: "nhatkap1"},
      title: "[Electro Pop] Versio - Feel It (ft. Nar)",
      uploadTime: new Date(),
      imageUrl: null,
      link: "/nhatkap1/electro-pop-versio-feel-it-ft-nar",
      src: "http://localhost:8081/nhatkap1/audio/electro-pop-versio-feel-it-ft-nar",
      tags: [],
      genres: []
    }, {
      artist: "Versio",
      code: "electro-pop-versio-feel-it-ft-nar",
      composer: "",
      description: "jljl",
      duration: "03:51",
      ext: ".mp3",
      id: 66,
      plays: 0,
      privacy: "_PRIVATE",
      uploader: {name: "nhat do", username: "nhatkap1"},
      title: "[Electro Pop] Versio - Feel It (ft. Nar)",
      uploadTime: new Date(),
      imageUrl: null,
      link: "/nhatkap1/electro-pop-versio-feel-it-ft-nar",
      src: "http://localhost:8081/nhatkap1/audio/electro-pop-versio-feel-it-ft-nar",
      tags: [],
      genres: []
    }]);
    this.songApp.setQueueIdx(0);
  }

  ngOnInit(): void {
    this.currentYear = moment().get('y');
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
}
