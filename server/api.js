
const path = require('path')
const fs = require('fs').promises
const DATABASE = require('./database')

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
		upload: async()=>{
			console.log("upload", req.body, req.file)
			const {file} = req;
			const fileName = req.body
			const hash = makeHash()
			const ext = path.extname(file.originalname)
			const dst = path.join("./files", hash +  ext)
			const thumbnail = path.join("./thumbnail", hash +  ext)
			await fs.copyFile(file.path, thumbnail)
			await fs.rename(file.path, dst)
			
						
			return await db.register(dst, thumbnail, req)
		}
	}
	const func = table[command]
	if( !func ) throw new Error("command not found")
	return await func()
}
