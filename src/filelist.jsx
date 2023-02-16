import React from 'react'

function File(props){
	const {data, listStyle} = props;

	const className = [
		"file",
		listStyle,
	]
	return (
		<div className={className.join(" ")}>
			<div className="icon">
				<img src="images/file.png" />
			</div>
		</div>
	)
}

export default function FileList(props){
	const {list, listStyle} = props;
	if( list === null){
		return (
			<div className="loading_frame">
				<img id="loading" src="./images/loading.png"/>
			</div>
		)
	}

	console.log("list", list)

	const files = list.map( (file, i)=>{
		const key = [
			list.length,
			i,
			file.fileName
		].join("_")
		
		return (
			<File {...props} data={file} key={i} />				
		)
	})
	return (
		<div className="file_list">
			{files}
		</div>
	)
}
