// import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class NativeStorageService {

  dataStorage = {
    schedule: []
  };

  private scheduleName = 'schedule';

  constructor(/*private nativeStorage: NativeStorage*/public storage: Storage, private dialogs: Dialogs) {
    /*this.nativeStorage.getItem('dataStorage')
    .then(
      data => this.dataStorage.schedule = data.schedule,
      error => console.error(error)
    );*/
    this.get(this.scheduleName)
    .then((res) => {
      if (res) {
        this.dataStorage.schedule = res;
      }
    })
    .catch(e => {
      console.log('error ' + JSON.stringify(e));
    });
  }

  getdataStorage() {
    return this.dataStorage;
  }

  addDataStorage(id) {
    const index = this.dataStorage.schedule.indexOf(id);
    if (index > -1) {
      this.dataStorage.schedule.splice(index, 1);
      this.set(this.scheduleName, this.dataStorage.schedule);
      /*this.nativeStorage.setItem('dataStorage', this.dataStorage)
      .then(
        () => console.log('Item saved'),
        error => console.log('Error displaying dialog', error)
      );*/
    } else {
      this.dataStorage.schedule.push(id);
      this.set(this.scheduleName, this.dataStorage.schedule);
      /*this.nativeStorage.setItem('dataStorage', this.dataStorage)
      .then(
        () => console.log('Item saved'),
        error => console.log('Error displaying dialog', error)
      );*/
    }
  }

  clearDataStorage() {
    this.dataStorage.schedule = [];
    this.set(this.scheduleName, this.dataStorage.schedule);
  }

  public set(settingName, value) {
    return this.storage.set(`setting:${ settingName }`, value);
  }
  public async get(settingName) {
    return await this.storage.get(`setting:${ settingName }`);
  }
  public async remove(settingName) {
    return await this.storage.remove(`setting:${ settingName }`);
  }
  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }
}
