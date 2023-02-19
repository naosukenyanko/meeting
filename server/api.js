
const path = require('path')
const fs = require('fs').promises
const DATABASE = require('./database')

const makeThumbnail = require('./thumbnail')
const getServerStatus = require('./status')


function makeHash(length = 64){
	const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789".split("")
	let result = ""
	for(let i=0 ; i<length ; i++){
		const index = Math.floor( Math.random() * alphabet.length )
		result += alphabet[index];
	}

	return result
}


module.exports = async function api(conf, req){
	const db = DATABASE(conf);
	
	const {command} = req.body
	if( !command ){
		throw new Error("command not found")
	}
	const table = {
		getList: async()=>{
			return await db.getList()
		},
		getConf: async ()=>{
			return {
				name: conf.name,
			}
		},
		deleteFile: async()=>{
			const {id} = req.body;
			if(id === undefined){
				throw new Error("id is undefined")
			}
			return await db.deleteFile(id)
		},
		setExpires: async()=>{
			const {id, expires} = req.body;
			return await db.setExpires(id, expires)
		},
		changeAlbum: async()=>{
			const {id, album} = req.body
			return await db.changeAlbum(id, album)
		},
		upload: async()=>{
			console.log("upload", req.body, req.file)
			const {file} = req;
			const {name} = req.body
			console.log(name, decodeURI(name) )
			const hash = makeHash()
			const ext = path.extname(file.originalname).toLowerCase()
			const dst = path.join("./files", hash +  ext)
			const thumbnail = await makeThumbnail(file, hash)
			
			await fs.rename(file.path, dst)
			
			
			return await db.register(dst, thumbnail, req)
		},
		getServerStatus: async()=>{
			return await getServerStatus();
		},
	}
	const func = table[command]
	if( !func ) throw new Error("command not found")
	return await func()
}
