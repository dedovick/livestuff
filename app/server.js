//const http = require('http')
const port = process.env.PORT || 3000
const ip = '0.0.0.0'
const server_url = 'https://live-stuff-server.herokuapp.com/'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const schedule = require('node-schedule');
const axios = require('axios');

// Create server
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const authMailer = {
  user: 'livestuff.app@gmail.com',
  pass: 'yjdsdigwwgvtzvsm'
}

// apiKey = 'AIzaSyDtbEKEUxgJb1TeugAVKTFIuTJmYocnvbE';
apiKey = 'AIzaSyDvU-p8k5p4mIDZd5J8_OsDmxep6o0VjrA';
// apiKey = 'AIzaSyD764OD2XbE_7QYqfZgkDW-8mZ7EqbEU4E';

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /events
    app.get('/events', (req, res) => {
      const today = new Date();
      const year = today.getUTCFullYear();
      const month = today.getUTCMonth() + 1;
      var date = today.getUTCDate();
	  //Vira a data de consulta às 6:00 UTC (3:00 BRT)
	  if(today.getUTCHours() <= 6){
		  date -= 1;
	  }
	  
	  var todayString = '';
      if (month > 9) {
        todayString = year + '-' + month;
      } else {
        todayString = year + '-0' + month;
      }
      if (date > 9) {
        todayString += '-' + date;
      } else {
        todayString += '-0' + date;
      }
      const post = db.get('event').filter(function(value, index, arr){ return value.data >= todayString;}).sortBy('time').sortBy('data').value();
      res.send(post)
    })

    // GET /events by date
    app.get('/events/:data', (req, res) => {
      const post = db.get('event').sortBy('time').filter({ data: req.params.data }).value();
      res.send(post)
    })

    // GET /events by idchannel
    app.get('/channels/events/:idyoutube', (req, res) => {
      const post = db.get('event').filter({ idYoutube: req.params.idyoutube }).value();
      res.send(post)
    })

    // GET /channels
    app.get('/channels', (req, res) => {
      //const post = db.get('posts').find({id : req.params.id}).value();
      const post = db.get('channel').sortBy('nome').value();
      res.send(post)
    })

    app.get('/categories', (req, res) => {
      const post = db.get('subcategorias').sortBy('nome').filter({ idCategoria: 1 }).value();
      res.send(post)
    })

	  app.get('/categorias', (req, res) => {
      const post = db.get('categorias').sortBy('ordem').value();
      res.send(post)
    })
	
	  app.get('/subcategorias/:idCategoria', (req, res) => {
      const post = db.get('subcategorias').sortBy('nome').filter({ idCategoria: parseInt(req.params.idCategoria) }).value();
      res.send(post)
    })
	
    app.get('/server', (req, res) => {
      res.send([{ 'serverUrl': server_url }]);
    })

    // POST /channels
    app.post('/channels', (req, res) => {
      console.log(req.body);
      db.get('channel')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post));
    })

    // POST /events
    app.post('/events', (req, res) => {
      console.log(req.body);
      db.get('event')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post));
    })

    // POST /suggest
    app.post('/suggest', (req, res) => {
      const mailOutput = "<html>\n\
                        <body>\n\
                        <table>\n\
                        <tr>\n\
                        <td>Email: </td><td>" + (req.body.hasOwnProperty('email') ? req.body.email : "não fornecido") + "</td>\n\
                        </tr>\n\
                        <tr>\n\
                        <td>Sugestão: </td>" + req.body.text + "<td></td>\n\
                        </tr>\n\
                        </table></body></html>";

      const mailOptions = {
        from: 'livestuff.app@gmail.com', // sender address
        to: 'livestuff.app@gmail.com', // list of receivers
        subject: 'Sugestões App', // Subject line
        html: mailOutput // html body
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: authMailer
      })

      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
        else
          console.log(info);
      })

      res.end('Email sent')
    })

    var rule = new schedule.RecurrenceRule();
    rule.hour = 21;
    rule.minute = 12;
    rule.second = 00;

    var j = schedule.scheduleJob(rule, function(){
      console.log('Entrou na rotina')
      // const events = db.get('event').filter({data : '2020-04-25'}).value();
      const channels = db.get('channel').value();

      // events.forEach(event => {
      //   console.log('Encontrou eventos: ' + event)
      //   axios.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&key=' + apiKey + '&id=' + event.videoId)
      //     .then(response => {
      //       console.log(response.data.items);
      //     })
      //     .catch(error => {
      //       console.log(error);
      //     });
      // });

      channels.forEach(channel => {
        
        console.log('Encontrou canais: ' + channel.nome)
        axios.get('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + apiKey + '&channelId=' + channel.idYoutube + '&type=video' + '&eventType=upcoming')
          .then(response1 => {
            console.log(response1.data.items);
            const isDataAvailable = Object.keys(response1.data.items).length > 0;
            
            if (isDataAvailable) {

              const hasValueInDb = db.get('event').filter({videoId : response1.data.items[0].id.videoId}).value();

              if (hasValueInDb.length > 0) {
                console.log('ALREADY HAVE');
              } else {
                console.log(response1.data.items[0].id);
                axios.get('https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=' + apiKey + '&id=' + response1.data.items[0].id.videoId)
                  .then(response2 => {
                    console.log(response2.data.items[0].liveStreamingDetails.scheduledStartTime);
                    // db.get('new_events')
                    //   .push({ artista: response1.data.items[0].channelTitle, data: response2.data.items[0].liveStreamingDetails.scheduledStartTime, time: response2.data.items[0].liveStreamingDetails.scheduledStartTime})
                    //   .write()
                })
                .catch(error => {
                  console.log(error);
                });
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
        }
      );
    });

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.listen(port, ip, () => console.log('listening on port 3000'))
  })
/*const server = http.createServer((req, res) => {

  const responses = []
  responses['/'] = '<h1>Home</h1>'
  responses['/shows'] = '<h1>Shows</h1>'
  responses['/search'] = '<h1>Search</h1>'
  responses['/naoExiste'] = '<h1>URL sem resposta definida!</h1>'

  res.end(responses[req.url] || responses['/naoExiste'])
})

server.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`)
  console.log('Para derrubar o servidor: ctrl + c');
})*/