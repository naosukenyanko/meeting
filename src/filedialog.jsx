import React from 'react'
import size from './size'
import formatDate from './formatdate'
import {makeList} from './albumdialog'
function extname(val){
	const m = String(val).match(/\.([^\.]+)$/)
	if( m ){
		return m[1]
	}
	return ""
}

function Content(props){
	const {data} = props
	const {fileName, filePath, thumbnail} = data
	const ext = extname(fileName).toLowerCase()
	console.log(ext)
	
	const images = ["gif", "png", "jpg", "jpeg", "ico"]
	const movies = ["mp4", "mov"]

	if( images.includes( ext )){
		console.log("image", ext)
		return (
			<img src={filePath}/>
		)
	}
	if( movies.includes(ext) ){
		console.log("moviex", ext)
		return (
			<video controls src={filePath}></video>
		)
	}
	return (
		<img src="./images/file.png"/>
	)
}

function Album(props){
	const {data, list} = props;
	const res = new Set()
	
	for(let item of list ){
		if( item.deleted == true ) continue
		res.add(item.album)
	}
	const keys = res.keys()

	//console.log("keys", keys)

	const albumList = []
	for(let key of keys){
		albumList.push(
			<option value={key} key={key}>{key || "(home)"}</option>
		)
		
	}

	const onChange = (evt)=>{
		props.onChangeAlbum(data, evt.target.value)
		props.close()
	}
	
	return (
		<select value={data.album} onChange={onChange}>
			{albumList}
		</select>
	)
}

export default function FileDialog(props){
	const {data, dialog} = props
	if( dialog !== "opened" ){
		return null
	}

	//console.log("open")
	
	const {fileName, filePath, thumbnail} = data


	const onClick = (evt)=>{
		evt.stopPropagation()
		props.close()
		
	}

	const onDownload = async()=>{
		let element = document.createElement('a');
		element.href = data.filePath
		element.download = decodeURI(data.fileName)
		element.target = '_blank';
		element.click();
	}
	const onDelete = async()=>{
		
		props.onDelete(data)
		props.close();
	}
	const onInfinite = async()=>{
		props.onInfinite(data)
		props.close();
	}
	const onLimit = async()=>{
		props.onLimit(data)
		props.close();
	}
	const cancel = (evt)=>{
		evt.stopPropagation()
	}
	
	return (
		<div className="dialog filedialog" onClick={cancel}>
			<button className="close" onClick={onClick}>☓</button >
			
			<div className="image_frame">
				<Content {...props}/>
			</div>
			
			<table>
				<thead></thead>
				<tbody>
					<tr>
						<th>ファイル名</th>
						<td>{data.fileName}</td>
					</tr>
					<tr>
						<th>アップロード日時</th>
						<td>{formatDate(data.created)}</td>
					</tr>
					<tr>
						<th>ユーザー</th>
						<td>{data.userName}</td>
					</tr>
					<tr>
						<th>サイズ</th>
						<td>{ size(data.fileSize) }</td>
					</tr>
					<tr>
						<th>アルバム</th>
						<td>
							<Album {...props}/>
						</td>
					</tr>
					<tr>
						<th>保存期限</th>
						<td>
							<div>{formatDate(data.expires, "YYYY/MM/DD")}</div>
							<button onClick={onLimit}>1年に変更</button>
							<button onClick={onInfinite}>無期限に変更</button>
						</td>
					</tr>

						
				</tbody>
				
			</table>
			
			<div className="buttons">
				<button onClick={onDownload}>ダウンロード</button>
				<button onClick={onDelete}>削除</button>
				
			</div>
		</div>
	)
}
