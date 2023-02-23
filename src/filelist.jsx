import React, {useState} from 'react'
import FileDialog from './filedialog'
import formatDate from './formatdate'

function zenkaku2Hankaku(str) {
	return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

}


function TextMatch( text, file){
	let {fileName} = file;
	const t = zenkaku2Hankaku( String(text) )
	const name = zenkaku2Hankaku( String( fileName ) )

	console.log(t, name)
	
	if( text.toLowerCase() === text ){		
		return name.toLowerCase().indexOf( t ) >= 0;
	}else{
		return name.indexOf( t ) >= 0
	}
}

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

function Checked(props){
	const {data, style, selected, mode} = props
	const {id} = data

	if(style.width < 64) return null
	if( mode !== "group" ) return null

	console.log("checked", selected, id)
	if( !selected.includes(id) ) return null

	
	return (
		<div className="checked">
			<img src="./images/checked.png"/>
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
	const {data, listStyle, mode} = props;

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
	const onClick = async()=>{
		if( mode === "single" ){
			setDialog("opened")
		}else{
			props.onSelect( data.id )
		}
		
	}

	const close = async()=>{
		setDialog("closed")
	}
	
	
	return (
		<div className={className.join(" ")} style={style}
			 onClick={onClick}>
			<div className="icon">
				<img src={src} style={imgStyle}/>
				<FileName {...props} style={style}/>
				<Expire {...props} style={style}/>
				<Movie {...props} style={style}/>
				<Checked {...props} style={style}/>
				
			</div>
			<FileDialog {...props} dialog={dialog} close={close}/>
		</div>
	)
}
				 
				 
				 
////////////////////////////////////////////////////

export default function FileList(props){
	const {list, listStyle, album, user, fileType, search} = props;
	if( list === null){
		return (
			<div className="loading_frame">
				<img id="loading" src="./images/loading.png"/>
			</div>
		)
	}

	//console.log("list", list)

	const files = list.filter( (file)=>{
		if( search ){
			if( !TextMatch(search, file) ) return false
		}else{
			if( file.album !== album ) return false;
		}
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
