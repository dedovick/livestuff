import { Component, OnInit, Input} from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CategoryService } from 'src/app/service/category.service';
import { NativeStorageService } from 'src/app/service/native-storage.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-live-card',
  templateUrl: './live-card.component.html',
  styleUrls: ['./live-card.component.scss'],
})
export class LiveCardComponent implements OnInit {
  @Input() event: any;
  @Input() todaystring: any;
  message = 'Live compartilhada pelo APP LiveStuff. Assista a live de ';
  dataStorage = {
    schedule: []
  };

  constructor( public plt: Platform, private socialSharing: SocialSharing, private categoryService: CategoryService, 
               private localNotifications: LocalNotifications, private dialogs: Dialogs, 
               private nativeStorageService: NativeStorageService) {
                 this.dataStorage = this.nativeStorageService.getdataStorage();
                /*this.nativeStorage.getItem('dataStorage')
                .then(
                  data => this.dataStorage = data,
                  error => console.error(error)
                );*/
              }
  monthList = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro'
  };

  ngOnInit() {
    this.categoryService.addSubCategory(this.event.type);
  }

  getMonth(month) {
    return this.monthList[month];
  }

  openUrl(event) {
    window.open(event.url, '_system');
  }

  sendShare(event) {
    this.socialSharing.share(this.message + event.artista + ' em', event.title, null, event.url);
    /*if (event.videoId && event.videoId !== '') {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.videoUrl + event.videoId);
    } else {
      this.socialSharing.share(this.message + event.artista, event.title, null, this.youtubeUrl + event.idYoutube);
    }*/
  }

  sheduleEvent(event) {
    const data = new Date(Number(event.data.substring(0, 4)), Number(event.data.substring(5, 7)) - 1,
      Number(event.data.substring(8, 10)), 9, 0, 0, 0);

    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'É hoje! Show de ' + event.artista + ' às ' + event.time,
      trigger: {at: new Date(data.getTime())},
      // trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
    });

    this.nativeStorageService.addDataStorage(event.id);

    this.dialogs.alert('Evento agendado! Você receberá uma notificação no dia ' + event.data.substring(8, 10) +
     '-' + event.data.substring(5, 7) + '!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }

  removeEvent(event) {
    this.nativeStorageService.addDataStorage(event.id);

    this.dialogs.alert('Evento removido!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }
}
