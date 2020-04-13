import { Component } from '@angular/core';
import { YtService } from '../services/yt/yt.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  today = new Date().getDate;
  events = [];
  constructor(private ytService: YtService) {
    this.events = this.ytService.getEvents();
  }

}
