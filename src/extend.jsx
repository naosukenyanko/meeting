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
				<ModeSwitch {...props}/>
				<button onClick={onClick}>サーバー状況</button>
			</div>

			<ServerStatus dialog={dialog}
						  {...props}
						  close={close}/>

			<GroupButtons {...props}/>
		</div>
	);
}

function ModeSwitch(props){
	const {mode} = props;
	//console.log("mode", mode)
	return (
		<button onClick={props.onSwitchMode} className={mode}>
			まとめて処理
		</button>

	)
}

function GroupButtons(props){
	const {mode} = props;

	if( mode !== "group" ){
		return null
	}

	return (
		<div className="group_buttons">
			<select >
				<option>保存期限変更</option>
				<option>一年</option>
				<option>無期限</option>
			</select>
			<select >
				<option>アルバム変更</option>
				<option>(home)</option>
			</select>
			<button>まとめて削除</button>
		</div>
	)
}
