import React, {useState} from "react"
import ServerStatus from './server'

function Search(props){
	const onChange = (evt)=>{
		props.onChange({search: evt.target.value});
	}
	return (
		<input type="text" value={props.search}
			   title="ファイル名検索"
			   placeholder="ファイル名検索"
			   onChange={onChange}/>
	)
}

function FileType(props){
	const onChange = (evt)=>{
		props.onChange({fileType: evt.target.value});
	}

	return (
		<select value={props.fileType}
				title="ユーザー"
				onChange={onChange}>
			<option value="all">すべて</option>
			<option value="image">自分のファイル</option>
		</select>
	)
}


export default function ExtendTools(props){
	const {extend, search, fileType} = props;

	if( extend !== "on" ) return null

	const [dialog, setDialog] = useState("closed")

	const onClick = (evt)=>{
		setDialog( "opened" )
	}

	const close = ()=>{
		setDialog("closed")
	}

	return (
		<div className="extend_tools">
			<Search {...props}/>

			<div>
				<FileType {...props}/>
				<button>まとめて処理</button>
				<button onClick={onClick}>サーバー状況</button>
			</div>

			<ServerStatus dialog={dialog}
						  close={close}/>
		</div>
	);
}
