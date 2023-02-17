import React from 'react'

import size from './size'

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
