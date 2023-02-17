import React from 'react'

function extname(val){
	const m = String(val).match(/\.([^\.]+)$/)
	if( m ){
		return m[1]
	}
	return ""
}

function formatDate(val, format = "YYYY/MM/DD hh:mm:dd"){

	const ss = (val)=>{
		return ("00" + val).slice(-2)
	}
	const d = new Date(val)
	let result = format
	result = result.replace("YYYY", d.getFullYear() )
	result = result.replace("MM", ss(d.getMonth()+1) )
	result = result.replace("DD", ss(d.getDate() ) )
	result = result.replace("hh", ss(d.getHours() ) )
	result = result.replace("mm", ss(d.getMinutes() ) )
	result = result.replace("dd", ss(d.getSeconds() ))
	return result
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
						<td>{data.fileSize}</td>
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
			</div>
		</div>
	)
}
