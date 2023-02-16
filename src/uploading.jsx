import React from 'react'

const kb = 1024
const mb = 1024 * kb
const gb = 1024 * mb

function size(val){

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

export default function Uploading(props){
	const {data} = props;

	if( !data ) return null

	const {file, progress} = data;

	const style = {
		width: progress.percent + "%",
		height: "100%"
	}
	
	return (
		<div className="uploading">
			<div className="bar" style={style}>
			</div>
			<div className="text">
				アップロード:{file.name} {size(progress.loaded)} / {size(progress.total)}
			</div>
		</div>
	)
}
