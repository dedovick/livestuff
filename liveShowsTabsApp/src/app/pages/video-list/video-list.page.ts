import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
  styleUrls: ['./video-list.page.scss'],
})
export class VideoListPage implements OnInit {

  videos: any;
  constructor(private route: ActivatedRoute, private router: Router, public plt: Platform,
              private youtube: YoutubeVideoPlayer,) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.videos = this.router.getCurrentNavigation().extras.state.videos;
      }
    });
  }


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

  goBack() {
    this.router.navigateByUrl('');
  }

  ngOnInit() {
  }

}
