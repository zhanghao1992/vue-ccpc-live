var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
io.on('connection', function (client) {
  client.on('add', function (data) {
    console.log(data)
    client.emit('senMsg', data)
  })
  client.on('disconnect', function () {})
})
server.listen(3000)
