import { NativeStorageService } from 'src/app/service/native-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServerClientService {

  // serverUrl = 'https://live-stuff-server.herokuapp.com/';
  // serverUrlGClound = 'http://34.67.130.241:3000/';
  serverUrl = 'http://34.67.130.241:3000/';
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(private http: HttpClient, private dialogs: Dialogs, private nativeStorage: NativeStorageService) {

  }

  // Handle API errors
    handleError(error: HttpErrorResponse) {

      this.dialogs.alert('Uaaaai:', error.error, 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));

      if (error.error instanceof ErrorEvent) {
        this.dialogs.alert('An error occurred:', error.error.message, 'Agenda')
          .then(() => console.log('Dialog dismissed'))
          .catch(e => console.log('Error displaying dialog', e));
      } else {
        this.dialogs.alert('Unknow error occurred:', error.error, 'Agenda')
          .then(() => console.log('Dialog dismissed'))
          .catch(e => console.log('Error displaying dialog', e));
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }

    // this function gets the channels from server.
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
    // this function gets the events by channel id
    getEventsByChannel(idYoutube) {
      return this.http.get(this.serverUrl + 'channels/events/' + idYoutube);
    }

    getEvents(data) {
      const params = new HttpParams().set('tz', this.tz);
      this.dialogs.alert('Uaaaai:', data, 'Agenda')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
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
      /*const data = {
        listaId: this.nativeStorage.getdataStorage().schedule
      };*/
      const listaIds = [
        '5ec1c8d6f1c6989ffb869894',
        '5ec1c8d6f1c6989ffb86996f'
      ];
      const httpHeader = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.http.post<any>(this.serverUrl + 'eventsById', JSON.stringify({listaIds}), httpHeader);
    }
}
