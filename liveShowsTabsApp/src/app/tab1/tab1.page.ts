import { Component } from '@angular/core';
import { YtService } from '../services/yt/yt.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  today = new Date().getDate;
  events = [];
  constructor(private ytService: YtService, public plt: Platform,
              private youtube: YoutubeVideoPlayer) {
    this.events = this.ytService.getEvents();
  }

  callYoutube(videoId) {
      // if we are on a device where cordova is available we user the youtube video player
      if (this.plt.is('cordova')) {
        this.youtube.openVideo(videoId); // opens video with videoId
      } else {
        window.open('https://www.youtube.com/watch?v=' + videoId);
      }
  }
}
