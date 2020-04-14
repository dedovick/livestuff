import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YtService {

  // tslint:disable-next-line:align
  channelList = [
    {
      snippet: {
        title: 'Jorge e Mateus'
      },
      id: 'UCL64gn1KZ1C-u87BGQv3b6w'
    },
    {
      snippet: {
        title: 'Bruno e Marrone'
      },
      id: 'UCdTX5ycRKPvTUiGu1519u4g'
    },
    {
      snippet: {
        title: 'Lucas Lucco'
      },
      id: 'UCBy6yIwHdhEEYG_nwHD-tiQ'
    },
    {
      snippet: {
        title: 'Léo santanta'
      },
      id: 'UCRai1xXd7kGQTE2-Z5mG_jg'
    },
    {
      snippet: {
        title: 'Wesley Safadão'
      },
      id: 'UCciJLMuECsXuOyhA4FO48Sg'
    }
  ];

  data = [
    {
        id: '',
        nome: 'Marília Mendonça',
        idYoutube: 'UCwfEOn0O1DWcyTgzVVu28ig',
        idFacebook: 'mariliamendoncaoficial',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Bruno e Marrone',
        idYoutube: 'UCdTX5ycRKPvTUiGu1519u4g',
        idFacebook: 'brunoemarrone',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Gustatavo Lima',
        idYoutube: 'UCXooz9whNJZBRTHi9AqdjPw',
        idFacebook: 'gusttavolimaoficial',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Zé Neto e Cristiano',
        idYoutube: 'UCRRu9OXVYd5clj2Bs29gUVQ',
        idFacebook: 'zncoficial',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Maiara e Maraisa',
        idYoutube: 'UCULzCZWkkOb9dW8rr6dguQQ',
        idFacebook: 'maiaraemaraisaoficial',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Wesley Safadão',
        idYoutube: 'UCYiAUICnsj880ou7j80U6vg',
        idFacebook: 'WesleySafadao',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Ferrugem',
        idYoutube: 'UCrbPlzWoueuZBkdVMRndw_Q',
        idFacebook: 'OficialFerrugem',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Henrique e Juliano',
        idYoutube: 'UCfLTxnQboSLcoSakgONmukQ',
        idFacebook: 'HenriqueeJuliano',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Gustavo Mioto',
        idYoutube: 'UCCCIzjqbX7psrn0HYG50phg',
        idFacebook: 'gumioto',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Luan Santana',
        idYoutube: 'UC6rwiIxv0w2fbmmr66wl1rA',
        idFacebook: 'luansantana',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
    {
        id: '',
        nome: 'Pearl Jam',
        idYoutube: 'UClQT6Vnsm6BUm0I5kR26EkQ',
        idFacebook: 'PearlJam',
        idVimeo: '',
        idTwitch: '',
        status: 0,
        categoria: 0
    },
  ];

  events = [
    {
        artista: 'Bruno & Marrone',
        idYoutube: 'UCdTX5ycRKPvTUiGu1519u4g',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '20',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Zé Neto & Cristiano',
        idYoutube: 'UCRRu9OXVYd5clj2Bs29gUVQ',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '18',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'online',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Wesley Safadão',
        idYoutube: 'UCYiAUICnsj880ou7j80U6vg',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '20',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'online',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Matheus e Kauan',
        idYoutube: 'UC4WvVh0AwJ6K9w1JLepce7A',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '16',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Michel Teló',
        idYoutube: 'UCs0vNuS1IQ0hCMgrD8ACjAg',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '20',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Henrique e Juliano',
        idYoutube: 'UCfLTxnQboSLcoSakgONmukQ',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '18',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Gustavo Mioto',
        idYoutube: 'UCCCIzjqbX7psrn0HYG50phg',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '20',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },
    {
        artista: 'Luan Santana',
        idYoutube: 'UC6rwiIxv0w2fbmmr66wl1rA',
        data: new Date("12-04-2020"),
        type: 'show',
        time: '18',
        largeimage: 'https://yt3.ggpht.com/a/AATXAJw0LUTJ_RUsfr8Fo_ZjoiCFZF8_kADrzajxAQ=s288-c-k-c0xffffffff-no-rj-mo',
        title: 'Título',
        status: 'offline',
        videoId: '6esCKTJoM4M'
    },

]
  apiKey = 'AIzaSyDtbEKEUxgJb1TeugAVKTFIuTJmYocnvbE';

  constructor(private http: HttpClient) { }

  // this function gets videos from the specified category from the youtube rest api
  getLiveVideos(category) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=' +
        category + '&key=' + this.apiKey + '&eventType=live');
    /*.subscribe((res) => {
      console.log(res['_body']);
      return res['_body'];
    });*/
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
    /*.subscribe((res) => {
      console.log(res['_body']);
      return res['_body'];
    });*/
  }

  getLiveBroadcast(event) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' +
    this.apiKey + '&channelId=' + event.idYoutube + '&type=video&eventType=upcoming');
  }

  getChannel(event) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' +
    this.apiKey + '&q=' + event.idYoutube + '');
  }

  // this function gets the categories from the youTube rest api.
  getCategories() {
    return this.channelList;
    /*return this.http.get('https://www.googleapis.com/youtube/v3/videoCategories?order=viewCount&part=snippet&regionCode=BR&key='+
    this.apiKey);*/
    /*.subscribe((res) => {
      console.log(res['_body']);
      return res['_body'];
    });*/
  }

  getEvents() {
    // tslint:disable-next-line:prefer-for-of
    /*for (let i = 0; i < this.events.length; i++) {
      const aux = i;
      const temp = this.getLiveBroadcast(this.events[i]);
      temp.subscribe(data => {
        if (data['items'] > 0) {
          data['items'].forEach(res => {
            // if video is not present in videos array, we push it into the array
            this.events[aux].largeimage = res.snippet.thumbnails.medium.url;
            this.events[aux].title = res.sniplet.title;
          });
        } else{
        const temp2 = this.getChannel((this.events[i]));
        temp2.subscribe(data2 => {
          if (data2['items'] > 0) {
              // if video is not present in videos array, we push it into the array
              this.events[aux].largeimage = data2['items'][0].snippet.thumbnails.medium.url;
              this.events[aux].title = data2['items'][0].sniplet.title;
            }
          }, async err => {
            // shows error alert if there is an issue with our subscription
          });
        }
      });
    }*/
    return this.events;
  }
}
