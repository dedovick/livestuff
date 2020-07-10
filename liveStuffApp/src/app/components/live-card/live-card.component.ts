import { Component, OnInit, Input} from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CategoryService } from 'src/app/service/category.service';
import { NativeStorageService } from 'src/app/service/native-storage.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import * as moment from 'moment';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AdMobPro } from '@ionic-native/admob-pro/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-live-card',
  templateUrl: './live-card.component.html',
  styleUrls: ['./live-card.component.scss'],
})
export class LiveCardComponent implements OnInit {
  @Input() event: any;
  @Input() today: Date;
  message = 'Live compartilhada pelo APP LiveStuff. Assista a live de ';
  dataStorage = {
    schedule: []
  };
  date: any;
  moment: any = moment;
  vidUrl: SafeResourceUrl;
  constructor( public plt: Platform, private socialSharing: SocialSharing, private categoryService: CategoryService,
               private localNotifications: LocalNotifications, private dialogs: Dialogs, private platform: Platform,
               private nativeStorageService: NativeStorageService, private ga: GoogleAnalytics, private admob: AdMobPro,
               private domSatinizer: DomSanitizer) {
              }
  monthList = {
    0: 'Janeiro',
    1: 'Fevereiro',
    2: 'Março',
    3: 'Abril',
    4: 'Maio',
    5: 'Junho',
    6: 'Julho',
    7: 'Agosto',
    8: 'Setembro',
    9: 'Outubro',
    10: 'Novembro',
    11: 'Dezembro'
  };
  weekdayList = {
    0: 'DOM',
    1: 'SEG',
    2: 'TER',
    3: 'QUA',
    4: 'QUI',
    5: 'SEX',
    6: 'SAB'
  };

  ngOnInit() {
    this.categoryService.addSubCategory(this.event.type);
    this.dataStorage = this.nativeStorageService.getdataStorage();
    this.date = new Date(this.event.dataHora);
    this.vidUrl = this.domSatinizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + 
      this.event.videoId);
  }

  getMonth(month) {
    return this.monthList[month];
  }

  getWeekday(day) {
    return this.weekdayList[day];
  }

  openUrl(event) {
    // this.reward();
    window.open(event.url, '_system');
  }

  sendShare(event) {
    this.ga.trackEvent('shareEvent', 'eventShared', 'Event: ' + event.artista);
    this.socialSharing.share(this.message + event.artista + ' em', event.title, null, event.url);
  }

  sheduleEvent(event) {
    this.ga.trackEvent('scheduleEvent', 'EventScheduled', 'event: ' + event.artista);
    // this.reward();
    const data = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 9, 0, 0, 0);

    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'É hoje! Live de ' + event.artista + ' às ' + event.time,
      trigger: {at: new Date(data.getTime())},
      // trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
    });

    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'Live de ' + event.artista + ' está começando agora!',
      trigger: {at: this.date.getTime()},
      led: 'FF0000',
      sound: null
    });

    this.nativeStorageService.addDataStorage(event.id);

    this.dialogs.alert('Evento agendado! Você receberá uma notificação no dia da live!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }

  removeEvent(event) {
    this.ga.trackEvent('scheduleEvent', 'EventRemoved', 'event: ' + event.artista);
    this.nativeStorageService.addDataStorage(event.id);

    this.dialogs.alert('Evento removido!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }

  ionViewDidLoad() {
    /*this.admob.onAdDismiss()
      .subscribe(() => { this.dialogs.alert('onAdDismiss', 'onAdDismiss');
                         window.open(this.event.url, '_system'); });
    this.admob.onAdLoaded()
    .subscribe(() => { this.dialogs.alert('onAdLoaded', 'onAdLoaded'); window.open(this.event.url, '_system'); });
    this.admob.onAdFailLoad()
    .subscribe(() => { this.dialogs.alert('onAdFailLoad', 'onAdFailLoad'); window.open(this.event.url, '_system'); });
    this.admob.onAdPresent()
    .subscribe(() => { this.dialogs.alert('onAdPresent', 'onAdPresent'); window.open(this.event.url, '_system'); });
    this.admob.onAdLeaveApp()
    .subscribe(() => { this.dialogs.alert('onAdLeaveApp', 'onAdLeaveApp'); window.open(this.event.url, '_system'); });*/
  }

  reward() {
    /*if (this.admob) {
      this.admob.prepareInterstitial( {adId: 'ca-app-pub-9511742733388692/9838672557', autoShow: true, isTesting: true} );
    if (this.admob) {
      this.admob.showInterstitial();
    }
    let adId;
    if (this.platform.is('android')) {
      adId = 'ca-app-pub-9511742733388692/9838672557';
    } else if (this.platform.is('ios')) {
      adId = 'ca-app-pub-9511742733388692/9838672557';
    }
    this.admob.prepareInterstitial({
      adId: adId,
      // autoShow: true,
      isTesting: true // remove in production 
    })
      .then(() => {
        this.admob.showRewardVideoAd();
        let hideFooterTimeout = setTimeout( () => {
              window.open(this.event.url, '_system');
        }, 4000);
      })
      .catch((err) => {
        console.log(err);
      });*/

  }
}
