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

function Album(props){
	const {data, list} = props;
	const res = new Set()
	
	for(let item of list ){
		if( item.deleted == true ) continue
		res.add(item.album)
	}
	const keys = res.keys()

	console.log("keys", keys)

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

	console.log("open")

	const {fileName, filePath, thumbnail} = data
	const ext = extname(fileName).toLowerCase()
	//console.log(ext)
	const images = ["gif", "png", "jpg", "jpeg", "ico"]

	let src = "./images/file.png"
	if( images.includes(ext) ){
		src = thumbnail
	}

	const onClick = (evt)=>{
		evt.stopPropagation()
		props.close()
		
	}

	const onDownload = async()=>{
		let element = document.createElement('a');
		element.href = data.filePath
		element.download = data.fileName
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
				<img src={src}/>
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
						<td>{formatDate(data.expires, "YYYY/MM/DD")}</td>
					</tr>

						
				</tbody>
				
			</table>
			
			<div className="buttons">
				<button onClick={onDownload}>ダウンロード</button>
				<button onClick={onDelete}>削除</button>
				<button onClick={onLimit}>保存期限を1年に変更</button>
				<button onClick={onInfinite}>保存期限を無期限に変更</button>
			</div>
		</div>
	)
}
