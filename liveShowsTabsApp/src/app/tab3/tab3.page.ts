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
  data = {
    text: ''
  };
    constructor(private ytService: YtService) {
    }

    ngOnInit() {
    }

    sendSuggest() {
      const res = this.ytService.postSuggest(this.data);
      res.subscribe(data => {
        console.log(data);
      });
    }
  }
