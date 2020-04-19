//const http = require('http')
const port = 3000
const ip = 'localhost'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const express = require('express')
const bodyParser = require('body-parser')

// Create server
const app = express()
app.use(bodyParser.json())

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

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'))
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