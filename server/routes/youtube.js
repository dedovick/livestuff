var express = require('express');
var router = express.Router();
var request = require('request');
var HashMap = require('hashmap');
var schedule = require('node-schedule');

const categoriesEnum = Object.freeze({ "Music": 10, "Gaming": 20, "Sports": 17 });

let ytMusicList = [];
var ytMusicMap = new HashMap();

const YT_API_KEY = 'AIzaSyDveWaNAV1WdCkO5iwuG9GVmN5s_NbvWKc'; //livestuff-server key

router.get('/getYtMusic', function (req, res) {
  musicList = [];
  ytMusicMap.forEach(video => {
    musicList.push(JSON.parse(JSON.stringify(video)));
  });
  res.send(musicList);
})

var event = schedule.scheduleJob("*/30 * * * *", youtubeStreamListUpdate());

function youtubeStreamListUpdate() {
  var options = {
    url: 'https://www.googleapis.com/youtube/v3/search?part=snippet' + `&key=${YT_API_KEY}` +
      '&type=video&eventType=live&order=viewCount' + `&videoCategoryId=${categoriesEnum.Music}` +
      '&relevanceLanguage=pt&maxResults=10',
    method: 'GET',
    headers: {}
  };
  request(options, function (error, response, body) {
    console.log("requested yt");
    ytMusicList = [];
    data = JSON.parse(body);
    console.log(data);
    var idList = '';
    data.items.forEach(video => {
      //ytMusicList.push(video.id.videoId);
      idList += video.id.videoId + ',';
      var lsObject = ytConverter(video)
      ytMusicList.push(ytConverter(video));
      ytMusicMap.set(lsObject.videoId, lsObject);
    });
    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA: ' + JSON.stringify(ytMusicList));
    var options = {
      url: 'https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails' + `&key=${YT_API_KEY}` +
        '&id=' + idList,
      method: 'GET',
      headers: {}
    };
    request(options, function (error, response, body) {
      data = JSON.parse(body);
      data.items.forEach(video => {
        ytMusicMap.get(video.id).concurrentViewers = video.liveStreamingDetails.concurrentViewers;
      });
      console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB: ' + JSON.stringify(ytMusicMap));
      // setTimeout(function() {
      //   youtubeStreamListUpdate();
      // }, 180000);
    });
  });
};

function ytConverter(ytObject) {
  var lsObject = {
    videoId: ytObject.id.videoId,
    artista: ytObject.snippet.channelTitle,
    title: ytObject.snippet.title,
    largeimage: ytObject.snippet.thumbnails.high.url,
    concurrentViewers: 0,
    type: ''
  }

  return lsObject;
}

module.exports = router;
