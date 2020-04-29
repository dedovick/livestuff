//const http = require('http')
const port = process.env.PORT || 3000
const ip = '0.0.0.0'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Create server
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /events
    app.get('/events', (req, res) => {
      const today = new Date();
      var todayString = '';
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();
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
      console.log('AAAAAAAA: ' + todayString);
      const post = db.get('event').sortBy('data').value();
      console.log(post);
      res.send(post)
    })

    // GET /events by date
    app.get('/events/:data', (req, res) => {
      const post = db.get('event').filter({ data: req.params.data}).value();
      console.log(post);
      res.send(post)
    })
    
    // GET /events by idchannel
    app.get('/channels/events/:idyoutube', (req, res) => {
      const post = db.get('event').filter({ idYoutube: req.params.idyoutube}).value();
      res.send(post)
    })

    // GET /channels
    app.get('/channels', (req, res) => {
      //const post = db.get('posts').find({id : req.params.id}).value();
      const post = db.get('channel').sortBy('nome').value();
      console.log(post);
      res.send(post)
    })
	
	// POST /events
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