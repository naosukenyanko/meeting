

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
			port: "80",
			pg_database: "meeting",
			pg_user: "postgres",
			
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
		//console.log(text, conf[key])
		data = data.replace(text, conf[key])
	}
	return data
}

async function run(){
	await makeDirs()
	const conf = await getConf()

	const {port} = conf

	const app = express()

	const api = async function(req){
		console.log("api", req.query, req.params)
		return [
			{
				id: 1,
				album_id: 1,
				fileName: "foo.jpg",
				filePath: "foo.jpg",
			},
			{
				id: 2,
				album_id: 1,
				fileName: "bar.jpg",
				filePath: "bar.jpg",
			}
		]
	}
	
	
	app.get(["/", "/index.html"], async(req, res)=>{
		console.log("index.html")
		const body = await getHTML("index.html", conf)
		res.writeHead(200, {'Content-Type': 'text/html'})
		res.end(body, 'utf-8')
	})

	app.post("/api", async(req, res)=>{
		try{
			const result = await api(req)
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
