import { Component } from '@angular/core';
import { YtService } from '../services/yt/yt.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  data = undefined;
  message = 'Assista a live de ';
  youtubeUrl = 'https://www.youtube.com/watch?v=';
  selectedData = undefined;
  events;
  selectedCat = [];
  categorias = [
    'sertanejo',
    'rock',
    'hip hop',
    'clássica',
    'eletrônica',
    'pop',
    'rap'
  ];


  constructor(private ytService: YtService, public plt: Platform,
              private youtube: YoutubeVideoPlayer, private socialSharing: SocialSharing) {
    // this.events = this.ytService.getEvents(new Date('2020-4-19'));
    const res = this.ytService.getEvents(this.data);
    res.subscribe(data => {
      this.events = data;
    });
  }

  callYoutube(videoId) {
      // if we are on a device where cordova is available we user the youtube video player
      if (this.plt.is('cordova')) {
        this.youtube.openVideo(videoId); // opens video with videoId
      } else {
        window.open('https://www.youtube.com/watch?v=' + videoId);
      }
  }

  updateMyDate() {
    const res = this.ytService.getEvents(this.selectedData.substring(0, 10));
    res.subscribe(data => {
      console.log(data);
      this.events = data;
    });
  }

  sendShare(event) {
    this.socialSharing.share(this.message + event.artista, event.title, null, this.youtubeUrl + event.videoId);
  }

  setCategoria(cat) {
    console.log('teste');
    if (this.selectedCat.indexOf(cat) > -1) {
      console.log('teste OK');
      const index = this.selectedCat.indexOf(cat);
      this.selectedCat.splice(index, 1);
    } else {
      console.log('teste NOK');
      this.selectedCat.push(cat);
    }
  }
}
