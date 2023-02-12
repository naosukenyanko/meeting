

const http = require('http')
const fs = require('fs').promises
const path = require('path')
const express = require('express')

async function makeDirs(){
	const list = [
		"./log",
		"./files",
		"./conf",
		"./compiled"
	]
	for(let name of list){
		await fs.mkdir( name, {recursive: true} )
	}	
}

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
	return conf
}

async function getHTML(src, conf){
	const filePath = path.join("./htdocs/", src)
	let data = ( await fs.readFile(filePath, {encoding: "utf-8"}) ).toString()
	for(let key in conf){
		const text = new RegExp("\\\$\{" + key + "\}")
		console.log(text, conf[key])
		data = data.replace(text, conf[key])
	}
	return data
}

async function run(){
	await makeDirs()
	const conf = await getConf()

	const {port} = conf

	const app = express()
	
	
	app.get(["/", "/index.html"], async(req, res)=>{
		console.log("index.html")
		const body = await getHTML("index.html", conf)
		res.writeHead(200, {'Content-Type': 'text/html'})
		res.end(body, 'utf-8')
	})
	app.use("/scripts/compiled", express.static('compiled'));
	app.use(express.static('htdocs'));

	app.listen(port, ()=>{
		console.log(`Server running at ${port}`)
	})
	

	/*
	http.createServer( (req, res)=>{
		res.writeHead(200, {'Content-Type': 'text/html'})
		res.end('<html><body><h1>Hello World</h1></body></html>', 'utf-8')
	}).listen(conf.port)
	
	*/
	
}

run()
