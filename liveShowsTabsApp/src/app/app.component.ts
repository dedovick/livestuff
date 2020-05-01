import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { YtService } from './services/yt/yt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ytProvider: YtService,
    private router: Router
  ) {
    const temp = this.ytProvider.getServerUrl();
    temp.subscribe(data => {
      this.ytProvider.setServerUrl(data[0].serverUrl);
      this.initializeApp();
    });
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.router.navigateByUrl('/tabs/tab1');
      this.platform.backButton.subscribeWithPriority(0, () => {
        navigator['app'].exitApp();
     });
    });
  }
}
