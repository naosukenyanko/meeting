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
	const onChangeAlbum = (evt)=>{
		props.onChangeAlbum(null, evt.target.value)
	}
	const albumList = getAlbumList(props.list)
	const onClick = (evt)=>{
		props.onDelete();
	}
	const onChangeLimit = (evt)=>{
		const {value} = evt.target
		if( value === "one"){
			props.onLimit()
		}else{
			props.onInfinite()
		}
	}
	
	return (
		<div className="group_buttons">
			<select value="" onChange={onChangeLimit}>
				<option value="">保存期限変更</option>
				<option value="one">一年</option>
				<option value="infinite">無期限</option>
			</select>
			<select value=" " onChange={onChangeAlbum}>
				<option value=" ">アルバム変更</option>
				<option value="">(home)</option>
				{albumList}
			</select>
			<button onClick={onClick}>まとめて削除</button>
		</div>
	)
}

function getAlbumList(list){
	const album = new Set()
	for(let file of list){
		if( !file.album ) continue
		album.add( file.album )
	}
	
	return [...album.keys()].sort().map( (name, i)=>{
		return (
			<option key={i} value={name}>{name}</option>
		)
	})
}
