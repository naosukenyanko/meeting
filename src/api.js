
import superagent from 'superagent'
const url = "./api"

export default {
	post: async(command, body = {})=>{
		console.log("post", command, body)
		
		
		const data = Object.assign({}, body, {
			command: command,
		})
		const result = await superagent.post(url)
			  .send(data)

		console.log("result", result)
		const res = JSON.parse( result.text )
		if( res.status === "success" ){
			return res.data
		}else{
			console.error( res.text )
		}
	},

	upload: async(file, progress)=>{
		const result = await superagent.post(url)
			  .field('command', 'upload')
			  .attach('file',file)
			  .on("progress", progress)

		console.log("result", result)
		const res = JSON.parse( result.text )
		if( res.status === "success" ){
			return res.data
		}else{
			console.error( res.text )
		}
	},
}
