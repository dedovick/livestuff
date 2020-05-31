import { NativeStorageService } from './service/native-storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ServerClientService } from './service/server-client.service';
import { CategoryService } from './service/category.service';
import { NgModule, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Globalization} from '@ionic-native/globalization/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerClientService,
    CategoryService,
    SocialSharing,
    LocalNotifications,
    Dialogs,
    GoogleAnalytics,
    NativeStorageService,
    DatePicker,
    Globalization,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
