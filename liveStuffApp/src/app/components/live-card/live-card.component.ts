import { Component, OnInit, Input} from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CategoryService } from 'src/app/service/category.service';
import { NativeStorageService } from 'src/app/service/native-storage.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import * as moment from 'moment';

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
  date: any;
  moment: any = moment;
  constructor( public plt: Platform, private socialSharing: SocialSharing, private categoryService: CategoryService, 
               private localNotifications: LocalNotifications, private dialogs: Dialogs,
               private nativeStorageService: NativeStorageService) {
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
  }

  getMonth(month) {
    return this.monthList[month];
  }

  getWeekday(day) {
    return this.weekdayList[day];
  }

  openUrl(event) {
    window.open(event.url, '_system');
  }

  sendShare(event) {
    this.socialSharing.share(this.message + event.artista + ' em', event.title, null, event.url);
  }

  sheduleEvent(event) {
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
    this.nativeStorageService.addDataStorage(event.id);

    this.dialogs.alert('Evento removido!', 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }
}
