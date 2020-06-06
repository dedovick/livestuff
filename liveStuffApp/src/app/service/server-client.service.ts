import { NativeStorageService } from 'src/app/service/native-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServerClientService {

  // serverUrl = 'https://live-stuff-server.herokuapp.com/';
  // serverUrlGClound = 'http://34.67.130.241:3000/';
  serverUrl = 'http://34.67.130.241:3000/';
  // serverUrl = 'https://34.67.130.241:8443/';
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(private http: HttpClient, private dialogs: Dialogs, private nativeStorage: NativeStorageService) {

  }

    getSubCategories() {
      return this.http.get(this.serverUrl + 'subcategories');
    }

    getCategories() {
      return this.http.get(this.serverUrl + 'categories');
    }

    getServerUrl() {
      return this.http.get('https://live-stuff-server.herokuapp.com/server');
    }

    setServerUrl(serverUrl: string) {
      this.serverUrl = serverUrl;
    }

    getChannels() {
      return this.http.get(this.serverUrl + 'channels');
    }
    
    getEventsByChannel(idYoutube) {
      return this.http.get(this.serverUrl + 'channels/events/' + idYoutube);
    }

    getEvents(data, cat) {
      const params = new HttpParams().set('tz', this.tz).set('cat', cat);
      if (data === undefined) {
        return this.http.get(this.serverUrl + 'events', {params});
      } else {
        return this.http.get(this.serverUrl + 'events/' + data, {params});
      }
    }

    postSuggest(data) {
      const httpHeader = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.post<any>(this.serverUrl + 'suggest', JSON.stringify(data), httpHeader);
    }

    getEventsById() {
      const listaIds = this.nativeStorage.getdataStorage().schedule;
      /*const listaIds = [
        '5ec1c8d6f1c6989ffb869894',
        '5ec1c8d6f1c6989ffb86996f'
      ];*/
      const httpHeader = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.post<any>(this.serverUrl + 'eventsById', JSON.stringify({listaIds}), httpHeader);
    }
}
