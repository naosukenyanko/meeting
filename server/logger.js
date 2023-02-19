
const fs = require('fs').promises;

function getTimestamp(){
	const d = new Date()
	const ss = (val)=>{
		return ("00" + val).slice(-2)
	}
	return [
		d.getFullYear(),
		ss(d.getMonth() + 1),
		ss(d.getDate()),
	].join("/") + " " + [
		ss(d.getHours()),
		ss(d.getMinutes()),
		ss(d.getSeconds()),
	].join(":") + "\t"
}

module.exports ={
	write: async(data)=>{
		const filePath = "./log/server.log"
		const timestamp = getTimestamp()

		const log =  timestamp + String(data) + "\n"
		await fs.appendFile(filePath, log)

	}
}
