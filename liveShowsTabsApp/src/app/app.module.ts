import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { YtService } from './services/yt/yt.service'; // Youtube provider import
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AdMobPro } from '@ionic-native/admob-pro/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicSelectableModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    YtService,
    YoutubeVideoPlayer,
    SocialSharing,
    LocalNotifications,
    Dialogs,
    NativeStorage,
    AdMobPro
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
