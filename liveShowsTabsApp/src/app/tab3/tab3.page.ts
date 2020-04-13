import { YtService } from './../services/yt/yt.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public gridImages: Array<any>;
  public headerName: any;
  topLevelSagment = 'image';
  videos: any;
  alertCtrl: any;
    constructor(private ytService: YtService, private router: Router) {

      this.gridImages = [
        { image: 'assets/categories/coffee-cup.jpg', id: '25'},
        { image: 'assets/categories/ball-fun.jpg', id: '17'},
        { image: 'assets/categories/people-at-concert.jpg', id: '10'},
        { image: 'assets/categories/silver-macbook.jpg', id: '20'},
        { image: 'assets/categories/people-at-theater.jpg', id: '23'},
        { image: 'assets/categories/anise-aroma.jpg', id: '24'}
      ];
     }

    ngOnInit() {
    }

    segmentChanged(ev: any) {
      console.log('Segment changed', ev);
      this.headerName = ev.detail.value;
      console.log(this.headerName + 'here');
      this.topLevelSagment = this.headerName;
      console.log('topLevelSagment ' + this.topLevelSagment);
    }

    getLiveVideos(id) {
      const temp = this.ytService.getLiveVideos(id); // defines temp as our http call in yt provider
      this.videos = []; // defines this.videos as an empty array

      temp.subscribe(data => {
        data['items'].forEach(res => {
          // if video is not present in videos array, we push it into the array
          if (this.videos.indexOf(res) === -1) {
            this.videos.push(res);
          }
        });
        const navigationExtras: NavigationExtras = {
          state: {
            videos: this.videos
          }
        };
        this.router.navigateByUrl('video-list', navigationExtras);
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
  }
