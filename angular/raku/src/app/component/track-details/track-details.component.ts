import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Song} from "../../model/Song";
import {TrackService} from "../../service/track.service";
import {AppSettings} from "../../global/app-settings";
import {Title} from "@angular/platform-browser";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import {AppService} from "../../service/app.service";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer";

@Component({
  selector: 'track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css']
})
export class TrackDetailsComponent implements OnInit, AfterViewInit {

  username: string;
  code: string;

  song: Song;
  faPlay = faPlay;
  faPause = faPause;

  isPlaying = false;

  wavesurfer: any;

  busy = false;

  constructor(private route: ActivatedRoute,
              private trackService: TrackService,
              private titleService: Title,
              public appService: AppService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params.username;
      this.code = params.code;

      this.trackService.getByCode(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.song = resp.data as Song;
          this.song.imageUrl = this.song.imageUrl ? (AppSettings.ENDPOINT + "/" + this.username + "/image/" + this.song.imageUrl) : null;
          this.song.src = AppSettings.ENDPOINT + "/" + this.username + "/audio/" + this.song.code;
          this.song.link = AppSettings.BASE_URL + "/" + this.username + "/" + this.song.code;
          this.titleService.setTitle(this.song.title + " || Listening on Raku");

          if (this.wavesurfer) {
            this.wavesurfer.load( AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.song.code);
          }
        }
      });

    });
    this.appService.playStateObs.subscribe(state => {
      this.isPlaying = state;
    });
  }

  ngAfterViewInit(): void {
    this.wavesurfer = WaveSurfer.create({
      container: '#audio-wave',
      waveColor: 'white',
      progressColor: '#ff5500',
      barWidth: 2,
      barHeight: 1,
      barGap: null,
      height: 100,
      cursorWidth: 0,
      hideScrollbar: true,
      responsive: true,
      xhr: {
        cache: 'default',
        mode: 'cors',
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'client',
        headers: []
      }
    });

    document.getElementById('audio-wave').addEventListener('mousedown', () => {
      this.busy = true;
    });

    document.getElementById('audio-wave').addEventListener('mouseup', () => {
      this.playTrack();
      setTimeout(() => {
        this.appService.setSeekTime(this.wavesurfer.getCurrentTime());
        this.busy = false;
      }, 100);
    });

    this.appService.currTimeObs.subscribe(time => {
      if ((time != null || time != undefined) && (this.song?.code == this.appService.getCurrentSong()?.code) && !this.busy) {
        let target = time / this.wavesurfer.getDuration();
        this.wavesurfer.seekTo(target > 1 ? 1 : (target < 0 ? 0 : target));
      }
    });

    this.trackService.getByCode(this.username, this.code).subscribe(resp => {
      if (resp.success) {
        this.song = resp.data as Song;
        this.song.imageUrl = this.song.imageUrl ? (AppSettings.ENDPOINT + "/" + this.username + "/image/" + this.song.imageUrl) : null;
        this.song.src = AppSettings.ENDPOINT + "/" + this.username + "/audio/" + this.song.code;
        this.song.link = "/" + this.username + "/" + this.song.code;
        this.titleService.setTitle(this.song.title + " || Listening on Raku");

        this.wavesurfer.load( AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.song.code);
      }
    });
  }

  playTrack() {
    if (this.song?.code == this.appService.getCurrentSong()?.code) {
      if (!this.appService.getPlayState()) {
        this.appService.setPlayState(true);
      }
    } else {
      this.appService.setSongQueue([this.song]);
      this.appService.setQueueIdx(0);
      this.appService.setPlayState(true);
    }
  }

  pauseTrack() {
    this.appService.setPlayState(false);
  }
}
