import React from 'react'

export default function FileList(props){
	const {list} = props;
	if( list === null){
		return (
			<div className="loading_frame">
				<img id="loading" src="./images/loading.png"/>
			</div>
		)
	}
	return (
		<div className="file_list">
			
		</div>
	)
}
