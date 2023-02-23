const {exec} = require('child_process')

/*
Linuxで運用することを想定してます
その他の環境は適宜処理を追加してください
*/

function getMemory(){
	return new Promise( (resolve, reject)=>{
		exec("free", (err, stdout)=>{
			
			const [head, body] = stdout.split("\n")
			//console.log("body", body)
			const [name, total, used] = body.split(/\s+/);
			//console.log("body", total, used)
			resolve({
				total: total * 1024,
				used: used * 1024
			})
		})
	})
}

function getStorage(){
	return new Promise ( (resolve, reject)=>{
		exec("df ./", (err, stdout)=>{
			console.log("storage", stdout);
			const [head, body] = stdout.split("\n")
			//console.log("body", body)
			const [name, total, used] = body.split(/\s+/);
			//console.log("body", total, used)
			resolve({
				total: total * 1024,
				used: used * 1024
			})
		})
	})
}

module.exports = async (db)=>{
	const memory = await getMemory()
	const storage = await getStorage()
	const deleted = await db.countDeletedFiles()
	return {
		storage,
		memory,
		deleted,
	}
}
