import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YtService {


  serverUrl = 'https://live-stuff-server.herokuapp.com/';

  constructor(private http: HttpClient) {
    //this.getServerUrl();
  }

  // this function gets the channels from server.
  getChannels() {
    return this.http.get(this.serverUrl + 'channels');
  }

  // this function gets the channels from server.
  getCategories() {
    return this.http.get(this.serverUrl + 'categories');
  }

  // this function gets the events by channel id
  getEventsByChannel(idYoutube) {
    return this.http.get(this.serverUrl + 'channels/events/' + idYoutube);
  }

  getEvents(data) {
    console.log('AAAAAAAAAAAAAAAAAAA: ' + this.serverUrl);
    if (data === undefined) {
      return this.http.get(this.serverUrl + 'events');
    } else {
      return this.http.get(this.serverUrl + 'events/' + data);
    }
  }

  postSuggest(data) {
    const httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<any>(this.serverUrl + 'suggest', JSON.stringify(data), httpHeader);
  }

  getServerUrl() {
    return this.http.get('https://live-stuff-server.herokuapp.com/server');
  }

  setServerUrl(serverUrl : string) {
    this.serverUrl = serverUrl;
  }
}
