
export default function formatDate(val, format = "YYYY/MM/DD hh:mm:dd"){

	if( !val ){
		return "--"
	}
	const ss = (val)=>{
		return ("00" + val).slice(-2)
	}
	const d = new Date(val)
	let result = format
	result = result.replace("YYYY", d.getFullYear() )
	result = result.replace("MM", ss(d.getMonth()+1) )
	result = result.replace("DD", ss(d.getDate() ) )
	result = result.replace("hh", ss(d.getHours() ) )
	result = result.replace("mm", ss(d.getMinutes() ) )
	result = result.replace("dd", ss(d.getSeconds() ))
	return result
}
