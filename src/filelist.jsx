import React, {useState} from 'react'
import FileDialog from './filedialog'

function extname(val){
	const m = String(val).match(/\.([^\.]+)$/)
	if( m ){
		return m[1]
	}
	return ""
}

function File(props){
	const {data, listStyle} = props;

	const style = {}
	const width = window.innerWidth
	if(listStyle === "large"){
		style.width = width / 2.0 -10
		style.height = width / 2.0 -10
	}
	if(listStyle === "medium"){
		style.width = width / 4.0 -10
		style.height = width / 4.0 -10
	}
	if(listStyle === "small"){
		style.width = width / 8.0 -10
		style.height = width / 8.0 -10
	}
	const imgStyle = {
		height: style.height,
		maxInlineSize: "none"
	}

	const className = [
		"file",
		listStyle,
	]

	const {fileName, filePath, thumbnail} = data
	const ext = extname(fileName).toLowerCase()
	//console.log(ext)
	const images = ["gif", "png", "jpg", "jpeg", "ico"]

	let src = "./images/file.png"
	if( images.includes(ext) ){
		src = thumbnail
	}

	const [dialog, setDialog] = useState("closed");
	const openDialog = async()=>{
		setDialog("opened")
		
	}

	const close = async()=>{
		setDialog("closed")
	}
	
	return (
		<div className={className.join(" ")} style={style} onClick={openDialog}>
			<div className="icon">
				<img src={src} style={imgStyle}/>
			</div>
			<FileDialog {...props} dialog={dialog} close={close}/>
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

	const files = list.filter( (file)=>{
		if( file.deleted == true ) return false
		const d = new Date();

		if( file.expires ){
			const expires = new Date(file.expires)
			if( d > expires ) return false
		}
		
		return true
	}).map( (file, i)=>{
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
