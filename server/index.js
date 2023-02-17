

const http = require('http')
const fs = require('fs').promises
const path = require('path')
const express = require('express')
const multer = require('multer')
const api = require('./api')

async function makeDirs(){
	const list = [
		"./log",
		"./files",
		"./conf",
		"./tmp",
		"./compiled",
		"./thumbnail",
	]
	for(let name of list){
		await fs.mkdir( name, {recursive: true} )
	}	
}

async function getConf(){
	const confPath = "./conf/server.json"
	let conf;

	try{
		const stat = await fs.stat(confPath)
	}catch(e){
		console.log("make", confPath)
		conf = {
			name: "test-community",
			port: "80",
			pg_database: "meeting",
			pg_user: "postgres",
			
		}
		await fs.writeFile(confPath, JSON.stringify(conf, null, '\t'))
	}

	conf = require( path.join("../" , confPath) )
	return conf
}


async function getHTML(src, conf){
	const filePath = path.join("./htdocs/", src)
	let data = ( await fs.readFile(filePath, {encoding: "utf-8"}) ).toString()
	for(let key in conf){
		const text = new RegExp("\\\$\{" + key + "\}")
		//console.log(text, conf[key])
		data = data.replace(text, conf[key])
	}
	return data
}



async function run(){
	await makeDirs()
	const conf = await getConf()

	const {port, limit = '1000mb'} = conf

	const app = express()

	app.use(express.json({extended: true, limit: limit}))
	//app.use(express.urlencoded({ extended: true, limit: limit }));
	

	
	app.get(["/", "/index.html"], async(req, res)=>{
		console.log("index.html")
		const body = await getHTML("index.html", conf)
		res.writeHead(200, {'Content-Type': 'text/html'})
		res.end(body, 'utf-8')
	})

	app.post("/api", multer({ dest: 'tmp/' }).single('file'), async(req, res)=>{
		try{
			const result = await api(conf, req)
			const data = JSON.stringify({status: "success", data: result})
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.end(data, 'utf-8')
		}catch(e){
			console.error(e)
			const data = JSON.stringify({status: "error", text: e})
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.end(data, 'utf-8')
		}
	})
	
	app.use("/scripts/compiled", express.static('compiled'));
	app.use("/files/", express.static('files'));
	app.use("/thumbnail/", express.static('thumbnail'));
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
