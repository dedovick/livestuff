import { CategoryService } from './category.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerClientService {

  // serverUrl = 'https://live-stuff-server.herokuapp.com/';
  // serverUrlGClound = 'http://34.67.130.241:3000/';
  serverUrl = 'http://34.67.130.241:3000/';

  constructor(private http: HttpClient) {

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
}
