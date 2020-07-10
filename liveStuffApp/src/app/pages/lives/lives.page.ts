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
  public options = {
    LIVE: 'live',
    SCHEDULE: 'schedule',
    DATA_INICIAL: 'di',
    DATA_FINAL: 'df'
  };
  public selectedOption = this.options.LIVE;
  public dataOptions = {
    di: false,
    df: false
  };
  categorias: any;
  events: any;
  selectedCat = '';
  hidesearchbar = true;
  hideoptionshbar = true;
  searchValue = '';
  today = new Date();
  selectedData = undefined;
  showData = '';
  showDataFinal = '';
  dataStorage: any;
  messageApp = 'Baixe o APP LiveStuff em ';
  appUrl = 'bit.ly/LiveStuffApp';
  allowEmptyMsg = false;
  form = {
    dataInicial: new Date(),
    dataFinal: new Date(),
  };

  public catList: any;
  /*public catList = [
    {
      title: 'Destaques',
      url: 'destaques',
      icon: 'star'
    }
  ];*/
  option: GlobalizationOptions;
  moment: any = moment;
  aux = '';

  constructor(private activatedRoute: ActivatedRoute, private serverClientService: ServerClientService,
              private categoryService: CategoryService, private changeDetectionRef: ChangeDetectorRef, private globalization: Globalization,
              private nativeStorageService: NativeStorageService, private loadingControllerService: LoadingControlleServiceService,
              private ga: GoogleAnalytics, private socialSharing: SocialSharing, private datePicker: DatePicker, private dialogs: Dialogs) {
                this.loadingControllerService.present();
                const date = new Date();
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
                this.showDataFinal = auxday + '-' + auxmonth + '-' + year;
              }

  async ngOnInit() {

    this.dataStorage = this.nativeStorageService.getdataStorage();
    // this.selectedComponent = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedComponent = {
      title: 'Salvos',
      url: 'salvos',
      icon: 'bookmark'
    };

    this.globalization.getPreferredLanguage()
    .then(res => moment.locale(res.value))
    .catch(e => moment.locale('pt-br'));

    this.categorias = this.categoryService.getSubCategorys();

    this.categoryService.clearData();
    const resCat = this.serverClientService.getCategories();
    resCat.subscribe(data => {
      this.catList = data;
      this.catList.push(
        {
          title: 'Salvos',
          url: 'salvos',
          icon: 'bookmark'
        }
      );
      this.selectedComponent = this.catList[0];
      const resLives = this.serverClientService.getEvents(undefined, this.selectedComponent.url);
      resLives.subscribe(
        dataEvents => {
          this.events = dataEvents;
          this.loadingControllerService.dismiss();
          this.changeDetectionRef.detectChanges();
          this.allowEmptyMsg = true;
        },
        error => {
          this.allowEmptyMsg = true;
        });
    });
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

  selectOption(option) {
    this.selectedOption = option;
  }

  openSearchBar() {
    if (!this.hidesearchbar) {
      this.searchValue = '';
    } else {
      this.ga.trackEvent('search', 'Search selecionado', 'search', 0);
    }
    this.hidesearchbar = !this.hidesearchbar;
  }

  openOptionsBar() {

    this.hideoptionshbar = !this.hideoptionshbar;
  }

  enableData(dataType) {
    if (dataType === this.options.DATA_INICIAL) {
      this.dataOptions.di = !this.dataOptions.di;
    } else if (dataType === this.options.DATA_FINAL) {
      this.dataOptions.df = !this.dataOptions.df;
    }
  }

  updateMyDate(dataType) {
    if (this.selectedData !== undefined) {
      this.ga.trackEvent('updateMyDate ' + dataType, 'Seleciona data', 'Data ' + dataType + ' : ' + this.selectedData, this.selectedData);
      this.loadingControllerService.present();
      this.categoryService.clearData();
      this.selectedCat = '';
      this.allowEmptyMsg = false;
      const res = this.serverClientService.getEvents(this.selectedData.substring(0, 10), this.selectedComponent.url);
      res.subscribe(data => {
        console.log(data);
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
        this.allowEmptyMsg = true;
      },
      error => {
        this.allowEmptyMsg = true;
      });
    }
  }

  selectData(dataType) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        console.log('Got date: ', date);
        this.ga.trackEvent('selectData', 'dataSelected', 'Data: ' + date.getDate + '/' + date.getMonth + '/' + date.getFullYear);

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
        if (dataType === this.options.DATA_INICIAL) {
          this.showData = auxday + '-' + auxmonth + '-' + year;
        } else {
          this.showDataFinal = auxday + '-' + auxmonth + '-' + year;
        }
        this.updateMyDate(dataType);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  selectCatBar(cat) {
    this.selectedComponent = cat;
    this.showData = 'DATA';
    this.loadingControllerService.present();
    this.categoryService.clearData();
    this.selectedData = undefined;
    this.selectedCat = '';

    this.ga.trackEvent('selectCatBar', 'Categoria selecionada', 'Categoria: ' + cat.title, cat.title);

    this.categorias = this.categoryService.getSubCategorys();

    this.categoryService.clearData();
    this.loadingControllerService.present();
    this.allowEmptyMsg = false;

    if (this.selectedComponent.url === 'salvos') {
      this.events = [];
      const resLives = this.serverClientService.getEventsById();
      resLives.subscribe(data => {
        this.updateSavedItens(data);
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
        this.allowEmptyMsg = true;
      },
      error => {
        this.allowEmptyMsg = true;
      });
    } else {
      const resLives = this.serverClientService.getEvents(undefined, this.selectedComponent.url);
      resLives.subscribe(data => {
        this.events = data;
        this.loadingControllerService.dismiss();
        this.changeDetectionRef.detectChanges();
        this.allowEmptyMsg = true;
      },
      error => {
        this.allowEmptyMsg = true;
      });
    }
  }

  shareApp() {
    this.ga.trackEvent('shareAPP', 'shareAPP', 'Share');
    this.socialSharing.share(this.messageApp, 'LiveStuff APP' , null, this.appUrl);
  }

  updateSavedItens(data) {
    this.nativeStorageService.clearDataStorage();
    data.forEach(element => {
      if (element.id) {
        this.nativeStorageService.addDataStorage(element.id);
      }
    });
  }
}
