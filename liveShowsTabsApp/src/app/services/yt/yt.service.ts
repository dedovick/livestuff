import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YtService {

  apiKey = 'AIzaSyDtbEKEUxgJb1TeugAVKTFIuTJmYocnvbE';

  constructor(private http: HttpClient) { }

  // this function gets videos from the specified category from the youtube rest api
  getLiveVideos(category) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=' +
        category + '&key=' + this.apiKey + '&eventType=live');
  }

  // Get live vídeos from a channel
  getNextLiveVideos(category) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=' +
        category + '&key=' + this.apiKey + '&eventType=upcoming');
  }

    // this function gets videos from the specified category from the youtube rest api
  getLiveVideosChannel() {
    return this.http.get('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&key=' +
    this.apiKey + '&broadcastStatus=active&broadcastType=all');
  }

  getLiveBroadcast(event) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' +
    this.apiKey + '&channelId=' + event.idYoutube + '&type=video&eventType=upcoming');
  }

  getChannel(event) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' +
    this.apiKey + '&q=' + event.idYoutube + '');
  }

  // this function gets the channels from server.
  getChannels() {
    return this.http.get('https://live-stuff-server.herokuapp.com/channels');
  }

  // this function gets the events by channel id
  getEventsByChannel(idYoutube) {
    return this.http.get('https://live-stuff-server.herokuapp.com/channels/events/' + idYoutube);
  }

  getEvents(data) {
    if (data === undefined) {
      return this.http.get('https://live-stuff-server.herokuapp.com/events');
    } else {
      return this.http.get('https://live-stuff-server.herokuapp.com/events/' + data);
    }
  }

  postSuggest(data) {
    const httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<any>('https://live-stuff-server.herokuapp.com/suggest', JSON.stringify(data), httpHeader);
  }
}
