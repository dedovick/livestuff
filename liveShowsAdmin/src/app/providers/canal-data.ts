import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CanalModel } from '../interfaces/canal-model';
import { ServerApp } from './server-app.service';


@Injectable({
  providedIn: 'root'
})
export class CanalData {

  canais: any = [];
  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    public serverApp: ServerApp
  ) { }

  addCanal(canal: CanalModel) {
    return this.serverApp.addChannel(canal);
  }

  
  getCanais() {
    return this.serverApp.getChannels();
  }

}
