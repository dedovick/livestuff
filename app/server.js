//const http = require('http')
const port = 3000
const ip = 'localhost'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const express = require('express')
const bodyParser = require('body-parser')
const schedule = require('node-schedule');
const axios = require('axios');

// Create server
const app = express()
app.use(bodyParser.json())

apiKey = 'AIzaSyDtbEKEUxgJb1TeugAVKTFIuTJmYocnvbE';

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /events
    app.get('/events', (req, res) => {
      console.log(req.params.id);
      //const post = db.get('posts').find({id : req.params.id}).value();
      const post = db.get('event').value();
      console.log(post);
      res.send(post)
    })

    // GET /channels
    app.get('/channels', (req, res) => {
      console.log(req.params.id);
      //const post = db.get('posts').find({id : req.params.id}).value();
      const post = db.get('channel').value();
      console.log(post);
      res.send(post)
    })

    var j = schedule.scheduleJob('* * * * *', function(){
      console.log('Entrou na rotina')
      const events = db.get('event').filter({data : '2020-04-25'}).value();
      events.forEach(event => {
        console.log('Encontrou eventos: ' + event)
        axios.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&key=' + apiKey + '&id=' + event.videoId)
          .then(response => {
            console.log(response.data.items);
          })
          .catch(error => {
            console.log(error);
          });
      });
    });

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'))
  })
