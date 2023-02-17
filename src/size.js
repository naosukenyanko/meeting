const kb = 1024
const mb = 1024 * kb
const gb = 1024 * mb


export default function size(val){

	const floor = (val)=>{
		if( val > 10 ){
			return Math.floor(val)
		}else{
			return Math.floor(val * 10 ) / 10.0
		}
	}
	if( val > gb ){
		return floor(val / gb) + "GB"
	}
	if( val > mb ){
		return floor(val / mb) + "MB"
	}
	if( val > kb ){
		return floor(val / kb) + "KB"
	}
	return val + "B"
}
