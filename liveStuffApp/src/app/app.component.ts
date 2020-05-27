import { Component, OnInit } from '@angular/core';

import { Platform, AlertController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Destaques',
      url: '/lives/destaques',
      icon: 'star'
    },
    {
      title: 'Música',
      url: '/lives/music',
      icon: 'musical-notes'
    },
    {
      title: 'Games',
      url: '/lives/games',
      icon: 'game-controller'
    },
    {
      title: 'Educação',
      url: '/lives/educacao',
      icon: 'library'
    },
    {
      title: 'Esportes',
      url: '/lives/esportes',
      icon: 'football'
    },
    {
      title: 'Comédia',
      url: '/lives/comedia',
      icon: 'happy'
    },
    {
      title: 'Variados',
      url: '/lives/variados',
      icon: 'images'
    },
    {
      title: 'Eventos salvos',
      url: '/lives/salvos',
      icon: 'bookmark'
    }
  ];

  public labels = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ga: GoogleAnalytics,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Inicia tracking google nalytics
      this.ga.startTrackerWithId('UA-166768231-1')
      .then(() => {}).catch(e => console.log('Error starting GoogleAnalytics == ' + e));

      // Comando de back button do celular, para sair da aplicação
      this.platform.backButton.subscribeWithPriority(0, async () => {
        const alert = await this.alertController.create({
          header: 'LiveStuff',
          message: '<strong>Deseja sair do app?</strong>!!!',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {}
            }, {
              text: 'Sim',
              handler: () => {
                navigator['app'].exitApp();
              }
            }
          ]
        });

        await alert.present();
        await alert.onDidDismiss();
     });
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
