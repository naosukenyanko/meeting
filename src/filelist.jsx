import React, {useState} from 'react'
import FileDialog from './filedialog'
import formatDate from './formatdate'

function extname(val){
	const m = String(val).match(/\.([^\.]+)$/)
	if( m ){
		return m[1]
	}
	return ""
}

function FileName(props){
	const {data, style} = props;
	const {fileName} = data;
	if(style.width < 64) return null
	
	return (
		<div className="file_name">
			{fileName}
		</div>
	);
}

function Expire(props){
	const {data, style} = props
	const {expires} = data

	if(style.width < 64) return null

	console.log("expires", expires)
	if( !expires ){
		return (
			<img className="expires" src="./images/infinite.png" title="無期限の保存"/>
		)
	}
	const d = new Date(expires)
	const base = new Date(
		d.getFullYear(), d.getMonth() , d.getDate() - 30 )
	if( base < new Date() ){
		return (
			<img className="expires" src="./images/caution.png" title="もうすぐ保存期限です"/>
		)
	}else{
		return null
	}
}

function Movie(props){
	const {data, style} = props
	if(style.width < 64) return null
	const {fileName, filePath, thumbnail} = data
	const ext = extname(filePath)
	const movie = ["mp4", "mov"]
	if( movie.includes(ext) ){
		return (<img className="movie" src="./images/play.png" title="動画ファイル"/>)
		
	}
	return null
}

function File(props){
	const {data, listStyle} = props;

	const margin = 20;
	const style = {}
	const width = window.innerWidth
	if(listStyle === "large"){
		style.width = width / 2.0 - margin
		style.height = width / 2.0 - margin
	}
	if(listStyle === "medium"){
		style.width = width / 4.0 - margin
		style.height = width / 4.0 - margin
	}
	if(listStyle === "small"){
		style.width = width / 8.0 - margin
		style.height = width / 8.0 -margin
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

	let src = "./images/file.png"
	if( thumbnail ){
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
				<FileName {...props} style={style}/>
				<Expire {...props} style={style}/>
				<Movie {...props} style={style}/>
				
			</div>
			<FileDialog {...props} dialog={dialog} close={close}/>
		</div>
	)
}
				 
				 
				 
////////////////////////////////////////////////////

export default function FileList(props){
	const {list, listStyle, album} = props;
	if( list === null){
		return (
			<div className="loading_frame">
				<img id="loading" src="./images/loading.png"/>
			</div>
		)
	}

	//console.log("list", list)

	const files = list.filter( (file)=>{
		if( file.album !== album ) return false;
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
