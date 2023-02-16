
import superagent from 'superagent'
export default {
	post: async(command, body = {})=>{
		console.log("post", command, body)
		
		const url = "./api"
		const data = Object.assign({}, body, {
			command: command,
		})
		const result = await superagent.post(url)
			  .send(body)

		console.log("result", result)
		const res = JSON.parse( result.text )
		if( res.status === "success" ){
			return res.data
		}else{
			console.error( res.text )
		}
	}
}
