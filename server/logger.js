const { Client } = require('pg')

const fs = require('fs').promises;

function getTimestamp(d){
	if( !d ){
		d = new Date()
	}
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

module.exports = function makeLogger(conf){
	const exec = async(query, args)=>{
		const client = new Client({
			user: conf.pg_user,
			database: conf.pg_database,
		})
		await client.connect()

		const res = await client.query(query, args)
		await client.end()
		return res;
	}


	return {
		write: async(ip, body)=>{
			const query = `INSERT INTO "log"("body", "ip") VALUES($1, $2)`
			await exec(query, [body, ip])
		},
		/*
		write: async(data)=>{
			const filePath = "./log/server.log"
			const timestamp = getTimestamp()
			
			const log =  timestamp + String(data) + "\n"
			await fs.appendFile(filePath, log)
			
		}
		*/
		download: async()=>{
			const query = `SELECT * FROM "log" `
				  + ` WHERE "timestamp" > CURRENT_TIMESTAMP - '1month'::interval` 
				  + ` ORDER BY "timestamp"`
			
			const result = await exec(query)
			return result.rows.map( (row)=>{
				return [
					getTimestamp( new Date(row.timestamp) ),
					row.body,
				].join("\t")
			}).join("\n")
		}
		
	}
}
