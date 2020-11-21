import {Component, OnInit} from '@angular/core';
import WaveSurfer from "../../../../node_modules/wavesurfer.js/dist/wavesurfer.js";

@Component({
  selector: 'app-your-tracks',
  templateUrl: './your-tracks.component.html',
  styleUrls: ['./your-tracks.component.css']
})
export class YourTracksComponent implements OnInit {

  wavesurfer: any;

  constructor() {
  }

  ngOnInit(): void {
    this.wavesurfer = WaveSurfer.create({
      container: '#wave',
      waveColor: 'white',
      progressColor: '#ff5500',
      barWidth: 2,
      barHeight: 1,
      barGap: null,
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
    this.wavesurfer.on('ready', () => {
      this.wavesurfer.resume().then(() => {
        this.wavesurfer.play();
      });
    });

    this.wavesurfer.load('http://localhost:8081/nhatkap1/audio-download/nang-am-xa-dan-onionn-remix');
  }

}
