import { YtService } from '../services/yt/yt.service';
import { Component } from '@angular/core';
import { AlertController, NavController, ModalController, Platform } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private categoryArray;
  private videos = [];
  constructor(public ytProvider: YtService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController, public plt: Platform, private youtube: YoutubeVideoPlayer) {
                // calls the function that gets all youtube categories
                this.getCategory();
    }
    // opens selected video for viewing
  viewVideo(vid) {
    // if we are on a device where cordova is available we user the youtube video player
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(vid.id.videoId); // opens video with videoId
    } else {
        if (vid.id === undefined || vid.id.videoId === undefined) {
          window.open('https://www.youtube.com/channel/' + vid);
        } else {
          // if we are not on a device where cordova is available we open the video in browser.
          window.open('https://www.youtube.com/watch?v=' + vid.id.videoId);
        }
    }
  }
  // this function presents videos based on category selected by user
    filter(value) {
      this.videos = []; // defines this.videos as an empty array
      const temp = this.ytProvider.getLiveBroadcast(value); // defines temp as our http call in yt provider
      // we subscrive to videos of category value here
      temp.subscribe(data => {
        data['items'].forEach(res => {
          // if video is not present in videos array, we push it into the array
          if (this.videos.indexOf(res) === -1) {
            this.videos.push(res);
          }
        });
      }, async err => {
        // shows error alert if there is an issue with our subscription
        const alert = this.alertCtrl.create({
          header: 'Error',
          message: JSON.stringify(err),
          buttons: ['OK']
        });
        (await alert).present(); // presents our alert
      });
    }
    // this function retrieves a list of the categories available on YouTube
    getCategory() {
      this.categoryArray = []; // defines out variable categoryArray as an empty array.
      this.categoryArray = this.ytProvider.getCategories();
  }
}
