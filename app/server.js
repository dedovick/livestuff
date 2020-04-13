const http = require('http')
const port = 3000
const ip = 'localhost'

const server = http.createServer((req, res) => {
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
})