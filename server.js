

const http = require('http')
const fs = require('fs').promises
const path = require('path')

async function getConf(){
	const confPath = "./conf/server.json"
	let conf;
	try{
		conf = require(confPath)
		return conf
	}catch(e){
		conf = {
			name: "test-community",
			port: "80"
		}
		await fs.writeFile(confPath, JSON.stringify(conf, null, '\t'))
	}
}

async function run(){

	const conf = await makeConf()

	http.createServer( (req, res)=>{
		res.writeHead(200, {'Content-Type': 'text/html'})
		res.end('<html><body><h1>Hello World</h1></body></html>', 'utf-8')
	}).listen(conf.port)
	
	console.log(`Server running at ${conf.port}`)
}

run()
