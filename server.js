

const http = require('http')
const fs = require('fs').promises
const path = require('path')

const conf = require('./conf/server.json')

http.createServer( (req, res)=>{
	res.writeHead(200, {'Content-Type': 'text/html'})
	res.end('<html><body><h1>Hello World</h1></body></html>', 'utf-8')
}).listen(conf.port)

console.log(`Server running at ${conf.port}`)