import { YtService } from '../services/yt/yt.service';
import { Component } from '@angular/core';
import { AlertController, NavController, ModalController, Platform } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  channelsArray;
  events;
  message = 'Assista a live de ';
  youtubeUrl = 'https://www.youtube.com/channel/';
  videoUrl = 'https://www.youtube.com/watch?v=';
  today = new Date();
  todayString = '';
  constructor(public ytProvider: YtService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController, public plt: Platform, private youtube: YoutubeVideoPlayer,
              private socialSharing: SocialSharing,
              private localNotifications: LocalNotifications,
              private dialogs: Dialogs) {
                const year = this.today.getFullYear();
                const month = this.today.getMonth() + 1;
                const date = this.today.getDate();
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
                // calls the function that gets all youtube categories
                this.getChannels();
    }

  // this function presents videos based on category selected by user
  filter(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.events = []; // defines this.videos as an empty array
    const temp = this.ytProvider.getEventsByChannel(event.value.idYoutube); // defines temp as our http call in yt provider
    // we subscrive to videos of category value here
    temp.subscribe(data => {
      console.log(data);
      this.events = data;
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
  getChannels() {
    this.channelsArray = []; // defines out variable categoryArray as an empty array.
    const temp = this.ytProvider.getChannels();
    temp.subscribe(data => {
      this.channelsArray = data;
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

  sendShare(event) {
    this.socialSharing.share(this.message + event.artista, event.title, null, event.url);
    /*if (event.videoId && event.videoId !== '') {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.videoUrl + event.videoId);
    } else {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.youtubeUrl + event.idYoutube);
    }*/
  }


  scheduleNotification( event) {
    const data = new Date(Number(event.data.substring(0, 4)), Number(event.data.substring(5, 7)),
      Number(event.data.substring(8, 10)), 12, 0, 0, 0);

    console.log('AAAAAAAAAAAAAAAAA: ' + data.getDate() + '-' + data.getMonth() + '-' + data.getFullYear() + ':' + data.getHours());

    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'Evento de notificação agendado',
      trigger: {at: new Date(data.getTime())},
      led: 'FF0000',
      sound: null
    });

    this.dialogs.alert('Evento agendado para o dia ' + data.getDate() + '-' + data.getMonth() + 1, 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));

  }
}
