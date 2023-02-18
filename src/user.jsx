import React, {useState} from 'react'
import storage from './storage'

function UserDialog(props){
	const {user, dialog} = props

	const init = storage.get("init")
	if(dialog !== "opened" && init == 1){
		return null
	}
	console.log(dialog, init)
	
	const [name, setName] = useState( user )
	const [extend, setExtend ] = useState( props.extend )
	const onChange = (evt)=>{
		setName(evt.target.value)
	}
	const onClick = (flag)=>{
		return ()=>{
			if(flag == "ok"){
				storage.set("user", name)
				storage.set("extend", extend)
				props.onChange({
					user: name,
					extend: extend,
				})
			}
			storage.set("init", 1)
			
			props.close()
		}
	}
	const cancel = (evt)=>{
		evt.stopPropagation()
	}
	const onChangeExtend = (evt)=>{
		setExtend( evt.target.value )
	}
	
	return (
		<div className="dialog user_dialog" onClick={cancel}>
			<p>名前を入力してください</p>
			<input type="text" value={name ?? ""} onChange={onChange}/>

			<p>拡張機能(PC向け)</p>
			<select value={extend} onChange={onChangeExtend}>
				<option value="on">使用する</option>
				<option value="off">使用しない</option>
			</select>
			
			<div>
				<button onClick={onClick("ok")}>
					OK
				</button>
				<button onClick={onClick("cancel")}>
					キャンセル
				</button>
			</div>
		</div>
	)
}

export default function User(props){
	const {user} = props;
	const [dialog, setDialog] = useState("closed")

	const onClick = ()=>{
		setDialog("opened")
	}

	const close = ()=>{
		setDialog("closed")
	}
	
	return (
		<div className="user" onClick={onClick}>
			<img src="./images/cat.png"/>
			<span>{user || "ゲスト"}</span>

			<UserDialog dialog={dialog} {...props} close={close}/>
		</div>
	)
}
