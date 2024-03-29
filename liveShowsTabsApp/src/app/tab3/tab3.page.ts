import { YtService } from './../services/yt/yt.service';
import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public gridImages: Array<any>;
  public headerName: any;
  topLevelSagment = 'image';
  videos: any;
  alertCtrl: any;
  public suggest: FormGroup;
  messageApp = 'Baixe o APP LiveStuff em ';
  appUrl = 'https://play.google.com/store/apps/details?id=live.stuff.ionic';

  constructor(private ytService: YtService, private formBuilder: FormBuilder,
              private socialSharing: SocialSharing, private dialogs: Dialogs) {
    this.suggest = this.formBuilder.group({
      text: ['', Validators.required],
      email: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
    });
  }

  ngOnInit() {
  }

  sendSuggest() {
    const res = this.ytService.postSuggest(this.suggest.value);
    res.subscribe(() => {
      this.suggest.reset();
    });

    this.dialogs.alert('Sugestão enviada com sucesso!', 'Sugestão')
     .then(() => console.log('Dialog dismissed'))
     .catch(e => console.log('Error displaying dialog', e));

    this.suggest.reset();
  }

  shareApp() {
    this.socialSharing.share(this.messageApp, 'LiveStuff APP' , null, this.appUrl);
  }

}
