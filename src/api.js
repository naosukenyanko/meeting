
import superagent from 'superagent'
export default {
	post: async(command, body = {})=>{
		console.log("post", command, body)
		
		const url = "/api"
		const data = Object.assign({}, body, {
			command: command,
		})
		const result = superagent.post(url)
			  .send(body)

		console.log("result", result)
		return JSON.parse( result.text )
	}
}
