import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Song} from "../../model/Song";
import {TrackService} from "../../service/track.service";
import {AppSettings} from "../../global/app-settings";
import {Title} from "@angular/platform-browser";
import {
  faCommentAlt,
  faEllipsisH,
  faHeadphones,
  faHeart,
  faList,
  faMusic,
  faPaperclip,
  faPause,
  faPlay,
  faReply,
  faShare,
  faUserCheck,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {AppService} from "../../service/app.service";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer";
import {UserPrincipal} from "../../model/UserPrincipal";
import {UserService} from "../../service/user.service";
import {UserTrackInfo} from "../../model/user-track-info";

@Component({
  selector: 'track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css']
})
export class TrackDetailsComponent implements OnInit, AfterViewInit {

  faPlay = faPlay;
  faPause = faPause;
  faHeart = faHeart;
  faPaperclip = faPaperclip;
  faShare = faShare;
  faEllipsisH = faEllipsisH;
  faHeadphones = faHeadphones;
  faCommentAlt = faCommentAlt;
  faUserCheck = faUserCheck;
  faMusic = faMusic;
  faUserPlus = faUserPlus;
  faReply = faReply;
  faList = faList;

  username: string;
  code: string;

  song: Song;
  isPlaying = false;
  wavesurfer: any;
  busy = false;
  currTimeStr: string;
  durationStr: string;
  user: UserPrincipal;
  userTrackInfo: UserTrackInfo;

  constructor(private route: ActivatedRoute,
              private trackService: TrackService,
              private titleService: Title,
              public appService: AppService,
              private userService: UserService) {
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
            this.wavesurfer.load(AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.song.code);
          }
        }
      });

      this.trackService.getUserTrackInfo(this.username, this.code).subscribe(resp => {
        if (resp.success) {
          this.userTrackInfo = resp.data as UserTrackInfo;
        }
      });

    });
    this.appService.playStateObs.subscribe(state => {
      this.isPlaying = state;
    });

    this.appService.userObs.subscribe(user => {
      this.user = user;
    })
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

    this.wavesurfer.on('ready', () => {
      this.durationStr = new Date(this.wavesurfer.getDuration() * 1000).toISOString().substr(11, 8);
      if (this.durationStr.substr(0, 2) == '00') {
        this.durationStr = this.durationStr.substr(3, 5);
      }
    });

    document.getElementById('audio-wave').addEventListener('mousedown', (e) => {
      this.busy = true;
    });

    document.getElementById('audio-wave').addEventListener('mouseup', (e) => {
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
        this.currTimeStr = new Date(time * 1000).toISOString().substr(11, 8);
        if (this.currTimeStr.substr(0, 2) == '00') {
          this.currTimeStr = this.currTimeStr.substr(3, 5);
        }
      }
    });

    this.trackService.getByCode(this.username, this.code).subscribe(resp => {
      if (resp.success) {
        this.song = resp.data as Song;
        this.song.imageUrl = this.song.imageUrl ? (AppSettings.ENDPOINT + "/" + this.username + "/image/" + this.song.imageUrl) : null;
        this.song.src = AppSettings.ENDPOINT + "/" + this.username + "/audio/" + this.song.code;
        this.song.link = "/" + this.username + "/" + this.song.code;
        this.titleService.setTitle(this.song.title + " || Listening on Raku");
        this.wavesurfer.load(AppSettings.ENDPOINT + "/" + this.username + "/audio-download/" + this.song.code);
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

  likeTrack() {
    this.userService.likeTrack(this.song.id).subscribe(resp => {
      if (resp.success) {
        this.trackService.getUserTrackInfo(this.username, this.code).subscribe(r => {
          if (r.success) {
            this.userTrackInfo.like = r.data.like;
            // xong thì nhảy số like của track ở stats lên (trên view)
          }
        });
      }
    });
  }

  repostTrack() {
    this.userService.repostTrack(this.song.id).subscribe(resp => {
      if (resp.success) {
        this.trackService.getUserTrackInfo(this.username, this.code).subscribe(r => {
          if (r.success) {
            this.userTrackInfo.repost = r.data.repost;
            // xong thì nhảy số repost của track ở stats lên (trên view)
          }
        });
      }
    });
  }

  followUploader() {
    this.userService.followUser(this.song.uploader.username).subscribe(resp => {
      if (resp.success) {
        this.trackService.getUserTrackInfo(this.username, this.code).subscribe(r => {
          if (r.success) {
            this.userTrackInfo.followUploader = r.data.followUploader;
            // xong thì nhảy số follow của uploader ở dưới avatar lên
          }
        });
      }
    });
  }
}
