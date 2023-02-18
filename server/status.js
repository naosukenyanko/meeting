const {exec} = require('child_process')

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

module.exports = async ()=>{
	const memory = await getMemory()
	const storage = await getStorage()
	
	return {
		storage: storage,
		memory,
	}
}
