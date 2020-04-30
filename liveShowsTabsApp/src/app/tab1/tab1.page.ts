import { Component } from '@angular/core';
import { YtService } from '../services/yt/yt.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  data = undefined;
  message = 'Assista a live de ';
  youtubeUrl = 'https://www.youtube.com/channel/';
  videoUrl = 'https://www.youtube.com/watch?v=';
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
    'rap',
    'pagode',
    'funk',
    'samba',
    'reagge'
  ];
  today = new Date();
  todayString = '';
  dataStorage = {
    schedule: []
  };
  constructor(private ytService: YtService, public plt: Platform,
              private youtube: YoutubeVideoPlayer, private socialSharing: SocialSharing,
              private localNotifications: LocalNotifications, private dialogs: Dialogs,
              private nativeStorage: NativeStorage) {

    // this.events = this.ytService.getEvents(new Date('2020-4-19'));
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1;
    const date = this.today.getDate();
    this.nativeStorage.getItem('dataStorage')
    .then(
      data => this.dataStorage = data,
      error => console.error(error)
    );
    if (month > 9) {
      this.todayString = year + '-' + month;
    } else {
      this.todayString = year + '-0' + month;
    }
    if (date > 9) {
      this.todayString += '-' + date;
    } else {
      this.todayString += '-0' + date;
    }
    const res = this.ytService.getEvents(this.data);
    res.subscribe(data => {
      this.events = data;
    });
  }

  callYoutube(event) {
    // if we are on a device where cordova is available we user the youtube video player
    if (this.plt.is('cordova')) {
      window.open(event.url, '_system');
      /*if (event.videoId && event.videoId !== '') {
        window.open(this.videoUrl + event.videoId, '_system');
        // this.youtube.openVideo(event.videoId); // opens video with videoId
      } else {
        window.open(this.youtubeUrl + event.idYoutube, '_system');
      }*/
    } else {
      window.open(event.url, '_system');
      /*if (event.videoId && event.videoId !== '') {
        window.open(this.videoUrl + event.videoId);
      } else {
        window.open(this.youtubeUrl + event.idYoutube);
      }*/
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
    this.socialSharing.share(this.message + event.artista, event.title, null, event.url);
    /*if (event.videoId && event.videoId !== '') {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.videoUrl + event.videoId);
    } else {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.youtubeUrl + event.idYoutube);
    }*/
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

  scheduleNotification( event) {

    const data = new Date(Number(event.data.substring(0, 4)), Number(event.data.substring(5, 7)) - 1,
      Number(event.data.substring(8, 10)), 9, 0, 0, 0);

    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'É hoje! Show do ' + event.artista + ' às ' + event.time,
      trigger: {at: new Date(data.getTime())},
      // trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
    });

    this.dataStorage.schedule.push(event.url);


    this.nativeStorage.setItem('dataStorage', this.dataStorage)
    .then(
      () => console.log('Item saved'),
      error => console.error('Error storing item', error)
    );

    this.dialogs.alert('Evento agendado! Você receberá uma notificação no dia ' + data.getDate() + '-' + (data.getMonth() + 1) +
     '!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));

  }

  cleanData() {
    this.selectedData = undefined;
    const res = this.ytService.getEvents(this.data);
    res.subscribe(data => {
      this.events = data;
    });
  }
}
