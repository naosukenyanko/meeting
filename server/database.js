
const { Client } = require('pg')
const makeLogger = require('./logger')

function date(year = 0, month = 0, date = 0){
	const d = new Date()

	return new Date(
		d.getFullYear() + year,
		d.getMonth() + month,
		d.getDate() + date
	)
}

module.exports = function(conf){

	const logger = makeLogger(conf)
	
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
			const {album = "", userName = "guest", ipAddress} = body;
			const list = [
				"album",
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
			const fileName = decodeURI(body.name)
			const args = [
				album,
				//file.originalname,
				fileName,
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

			const [res = {}] = result.rows;
			logger.write(null, `register (${res.id}, ${fileName}, ${filePath})`)

			//console.log(result)
			
			return result.rows
		},
		getList: async()=>{
			const query = `SELECT * FROM "files" ORDER BY created DESC`
			const result = await exec(query)
			return result.rows;
		},
		setExpires: async(id, expires)=>{
			const query = `UPDATE files set "expires" = $1 `
				  + ` WHERE "id"=$2 `
				  + ` RETURNING "id"`
			const result = await exec(query, [expires, id])
			return result.rows;
		},
		deleteFile: async(id)=>{
			const query = `UPDATE files set "deleted" = true `
				  + ` WHERE "id"=$1 `
				  + ` RETURNING "id"`
			const result = await exec(query, [id])
			return result.rows;
		},
		changeAlbum: async(id, name)=>{
			const query = `UPDATE files set "album" = $1`
				  + ` WHERE "id"=$2 `
				  + ` RETURNING "id"`
			const result = await exec(query, [name, id])
			return result.rows;
		},
		countDeletedFiles: async()=>{
			const query = `SELECT SUM("fileSize") AS "size" ` 
				  + `, COUNT(*) AS "count"`
				  + `FROM files `
				  + ` WHERE deleted=true `
				  + ` OR expires < CURRENT_DATE`
			
			const result = await exec(query)
			const item = result.rows[0]
			return {
				size: item.size ?? 0,
				count: item.count ?? 0,
			}
		},
		cleanup: async()=>{
			const query = `delete FROM "files" `
				  + ` WHERE "deleted"=true`
				  + ` OR "expires" < CURRENT_DATE`
				  + ` RETURNING "id", "filePath", "thumbnail"`

			//console.log(query)
			return await exec(query)
		},
		
	}
}

