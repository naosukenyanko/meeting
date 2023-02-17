
const { Client } = require('pg')

function date(year = 0, month = 0, date = 0){
	const d = new Date()

	return new Date(
		d.getFullYear() + year,
		d.getMonth() + month,
		d.getDate() + date
	)
}

module.exports = function(conf){
	
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
		register: async(filePath, thumbnail, req)=>{
			console.log("register", filePath, req.body)
			const {file, body} = req;
			const {albumID = 0, userName = "guest", ipAddress} = body;
			const list = [
				"albumID",
				"fileName",
				"filePath",
				"thumbnail",
				"expires",
				"userName",
				"ipAddress",
				"fileSize",
				"created",
			]

			const cols = list.map( (item)=>{
				return `"${item}"`
			}).join(",")

			const ph = list.map( (item,i)=>{
				return `\$${i+1}`
			}).join(",")
			
			const query = `INSERT INTO "files"(${cols}) VALUES(${ph}) `
				  + "RETURNING id"
			const args = [
				albumID,
				file.originalname,
				filePath,
				thumbnail,
				date(1),
				userName,
				ipAddress,
				file.size,
				new Date(),
			]

			//console.log("query", query)
			
			const result = await exec(query, args)

			console.log(result)
			
			return result.rows
		},
		getList: async()=>{
			const query = `SELECT * FROM "files" ORDER BY created`
			const result = await exec(query)
			return result.rows;
		},
		deleteFile: async(id)=>{
			const query = `UPDATE files set "deleted" = true `
				  + ` WHERE "id"=$1 `
				  + ` RETURNING "id"`
			const result = await exec(query, [id])
			return result.rows;
		}
	}
}

