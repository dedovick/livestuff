import { NativeStorageService } from './../..//service/native-storage.service';
import { CategoryService } from './../../service/category.service';
import { ServerClientService } from './../../service/server-client.service';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingControlleServiceService } from 'src/app/service/loading-controlle-service.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Globalization, GlobalizationOptions } from '@ionic-native/globalization/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-lives',
  templateUrl: './lives.page.html',
  styleUrls: ['./lives.page.scss'],
})
export class LivesPage implements OnInit {
  public selectedComponent: any;
  categorias: any;
  events: any;
  selectedCat = '';
  hidesearchbar = true;
  hidecategorybar = true;
  searchValue = '';
  todayString = '';
  today = new Date();
  selectedData = undefined;
  showData = 'DATA';
  dataStorage: any;
  messageApp = 'Baixe o APP LiveStuff em ';
  appUrl = 'bit.ly/LiveStuffApp';

  public catList = [
    {
      title: 'Destaques',
      url: 'destaques',
      icon: 'star'
    },
    {
      title: 'Música',
      url: 'music',
      icon: 'musical-notes'
    },
    {
      title: 'Games',
      url: 'games',
      icon: 'game-controller'
    },
    {
      title: 'Educação',
      url: 'educacao',
      icon: 'library'
    },
    {
      title: 'Esportes',
      url: 'esportes',
      icon: 'football'
    },
    {
      title: 'Comédia',
      url: 'comedia',
      icon: 'happy'
    },
    {
      title: 'Variados',
      url: 'variados',
      icon: 'images'
    },
    {
      title: 'Salvos',
      url: 'salvos',
      icon: 'bookmark'
    }
  ];
  option: GlobalizationOptions;
  moment: any = moment;

  constructor(private activatedRoute: ActivatedRoute, private serverClientService: ServerClientService,
              private categoryService: CategoryService, private changeDetectionRef: ChangeDetectorRef, private globalization: Globalization,
              private nativeStorageService: NativeStorageService, private loadingControllerService: LoadingControlleServiceService,
              private ga: GoogleAnalytics, private socialSharing: SocialSharing, private datePicker: DatePicker, private dialogs: Dialogs) {
                this.loadingControllerService.present();
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
              }

  async ngOnInit() {

    this.dataStorage = this.nativeStorageService.getdataStorage();
    // this.selectedComponent = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedComponent = this.catList[0];
    moment.locale('pt-br');
    
    this.globalization.getPreferredLanguage()
    .then(res => moment.locale(res.value))
    .catch(e => console.log(e));

    this.categorias = this.categoryService.getSubCategorys();

    this.categoryService.clearData();
    const resLives = this.serverClientService.getEvents(undefined);
    resLives.subscribe(data => {
      this.events = data;
      this.loadingControllerService.dismiss();
      this.changeDetectionRef.detectChanges();

    },
    err => {
      this.dialogs.alert('Error:', err, 'Erro')
        .then(() => console.log('Dialog dismissed'))
        .catch(e => console.log('Error displaying dialog', e));
    },
    () => console.log('HTTP request completed.'));
  }

  selectCategory(category) {
    if (this.selectedCat === category) {
      this.ga.trackEvent('selectCategory', 'Remove subCategoria', 'subCategoria: ' + category, category);
      this.selectedCat = '';
    } else {
      this.ga.trackEvent('selectCategory', 'Seleciona subCategoria', 'subCategoria: ' + category, category);
      this.selectedCat = category;
    }
  }

  openSearchBar() {
    if (!this.hidesearchbar) {
      this.searchValue = '';
    } else {
      this.ga.trackEvent('search', 'Search selecionado', 'search', 0);
    }
    this.hidesearchbar = !this.hidesearchbar;
  }

  cleanData() {
    if (this.selectedData !== undefined) {
      this.showData = 'DATA';
      this.loadingControllerService.present();
      this.categoryService.clearData();
      this.selectedData = undefined;
      const res = this.serverClientService.getEvents(undefined);
      res.subscribe(data => {
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
      });
    }
  }

  updateMyDate() {
    if (this.selectedData !== undefined) {
      this.ga.trackEvent('updateMyDate', 'Seleciona data', 'Data: ' + this.selectedData, this.selectedData);
      this.loadingControllerService.present();
      this.categoryService.clearData();
      this.selectedCat = '';
      const res = this.serverClientService.getEvents(this.selectedData.substring(0, 10));
      res.subscribe(data => {
        console.log(data);
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
      });
    }
  }

  selectData() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        console.log('Got date: ', date);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let auxmonth = '';
        let auxday = '';
        if (month > 9) {
          this.selectedData = year + '-' + month;
          auxmonth = month.toString();
        } else {
          this.selectedData = year + '-0' + month;
          auxmonth = '0' + month;
        }
        if (day > 9) {
          this.selectedData += '-' + day;
          auxday = day.toString();
        } else {
          this.selectedData += '-0' + day;
          auxday = '0' + day;
        }
        this.showData = auxday + '-' + auxmonth + '-' + year;
        this.updateMyDate();
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  openCategoryBar() {
    this.hidecategorybar = !this.hidecategorybar;
    if (!this.hidesearchbar) {
      this.searchValue = '';
      this.hidesearchbar = !this.hidesearchbar;
    }
  }

  selectCatBar(cat) {
    this.selectedComponent = cat;
    this.selectedData = undefined;
    this.selectedCat = '';

    this.ga.trackEvent('selectCatBar', 'Categoria selecionada', 'Categoria: ' + cat.title, cat.title);

    this.categorias = this.categoryService.getSubCategorys();

    this.categoryService.clearData();
    this.loadingControllerService.present();

    if (this.selectedComponent.url === 'salvos') {
      const resLives = this.serverClientService.getEventsById();
      resLives.subscribe(data => {
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
      });
    } else {
      const resLives = this.serverClientService.getEvents(undefined);
      resLives.subscribe(data => {
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
      });
    }
    this.hidecategorybar = !this.hidecategorybar;
  }

  shareApp() {
    this.socialSharing.share(this.messageApp, 'LiveStuff APP' , null, this.appUrl);
  }
}
