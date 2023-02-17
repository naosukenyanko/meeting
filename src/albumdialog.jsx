import React,{ useState} from 'react'
import storage from './storage'

export function makeList(list, onClick){
	const res = new Set()

	for(let item of list ){
		if( item.deleted == true ) continue
		res.add(item.album)
	}
	const keys = res.keys()

	//console.log("makeList", list, keys)
	
	const result = []
	for(let key of keys){
		console.log("key", key)
		result.push((
			<li key={key || ""} onClick={onClick(key)}>
				{key || "(home)"}
			</li>
		))
	}

	return result
}

export default function AlbumDialog(props){
	const {dialog, album, list} = props;
	if( dialog !== "opened" ) return null;

	const [ name, setName ] = useState(album)
	const onChange = (evt)=>{
		setName(evt.target.value)
	}

	const onClickList = (name)=>{
		return ()=>{
			setName(name)
		}
	}
	const albumList = makeList(list, onClickList)

	const onClick = (flag)=>{
		return (evt)=>{
			if(flag === "ok"){
				const value = String(name).replace(/\s/gi, "")
				storage.set("album", value)
				props.onChange({album: value})
			}
			props.close()
		}
	}

	const cancel = (evt)=>{
		evt.stopPropagation()
	}
	
	return (
		<div className="dialog albumdialog" onClick={cancel}>
			<p>アルバム切り替え</p>
			<input className="album_name" type="text" placeholder="home" value={name}
				   onChange={onChange} />

			<div>
				<ul>
					{albumList}
				</ul>
			</div>
			<div className="buttons">
				<button onClick={onClick("ok")}>OK</button>
				<button onClick={onClick("cancel")}>Cancel</button>
			</div>
		</div>
	)
}
