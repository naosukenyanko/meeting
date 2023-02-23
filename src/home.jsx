import React from "react";
import ReactDOM from "react-dom";
import api from './api'
import FileList from './filelist'
import Header from './header'
import Uploading from './uploading'
import storage from './storage'
import User from './user'
import "./theme.scss"
import Extend from './extend'

import { createRoot } from 'react-dom/client';

function getExpire(num){
	const d = new Date()
	return new Date(
		d.getFullYear()+num,
		d.getMonth(),
		d.getDate()
	)
}

export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			user: storage.get("user"),
			list: null,
			listStyle: storage.get("listStyle") || "large",
			config: {
				name: ""
			},
			album: storage.get("album") || "",
			uploading: null,
			extend: storage.get("extend") ?? "off",
			search: "",
			fileType: "all",
			mode: "single",
			selected: [],
		}
	}

	componentDidMount(){
		this.load()
		window.addEventListener("resize", ()=>{
			console.log("resize")
			this.setState({innerWidth: window.innerWidth})
		})
	}

	async load(){
		const {album, user} = this.state;
		const config = await api.post("getConf", {user})
		const list = await api.post("getList", {user})
		this.setState({list, config})
	}

	async upload(files){
		const {album, user} = this.state;
		console.log("upload", files)
		for(let i=0; i<files.length ; i++){
			const file = files[i]
			console.log("upload", file)
			const ops = {
				user: user,
				album: album,
				userName: user || "guest",
				name: encodeURI(file.name)
			}
			const progress = (evt)=>{
				console.log("proc", evt)
				
				this.setState({
					uploading: {file, progress: evt}
				})
			}
			const proc = await api.upload( file, ops, progress )
		}
		this.setState({uploading: null})
		await this.load()
	}

	async onChangeAlbum(file, name){
		console.log("change album", file, name)
		const {user} = this.state;
		const result = await api.post("changeAlbum", {
			id: file.id,
			album: name,
			user: user,
		})
		await this.load();
	}

	async onDelete(file){
		const {user} = this.state;
		const result = await api.post("deleteFile", {id: file.id, user})
		await this.load();
	}

	async onInfinite(file){
		const {user} = this.state;
		const result = await api.post("setExpires", {
			id: file.id,
			user,
			expires: null,
		})
		await this.load();
	}

	async onCleanUp(file){
		const {user} = this.state;
		const result = await api.post("cleanup", {
			user,
		})
		await this.load();
	}
	
	async onLimit(file){
		const {user} = this.state;
		const result = await api.post("setExpires", {
			id: file.id,
			user,
			expires: getExpire(1)
		})
		await this.load();		
	}

	async onSwitchMode(){
		const {mode} = this.state
		this.setState({
			mode: mode === "single" ? "group": "single",
			selected: [],
		})
	}

	onSelect(index){
		const {selected} = this.state
		const pos = selected.indexOf(index)
		if( pos >= 0 ){
			selected.splice(pos, 1)
		}else{
			selected.push( index )
		}
		console.log("selected", selected)
		this.setState({selected})
	}
	
	render(){
		const onChange = (obj)=>{
			this.setState(obj)
		}
		const {list, listStyle, config, user, uploading} = this.state
		const {album, albumList} = this.state;
		const {extend, search, fileType} = this.state;
		const {mode, selected} = this.state;
		
		return (
			<div className="main_frame">
				<Header user={user}
						mode={mode}
						config={config}
						listStyle={listStyle}
						list={list}
						album={album}
						onChange={onChange}						
						onUpload={this.upload.bind(this)}>

					<Extend extend={extend}
							search={search}
							mode={mode}
							onSwitchMode={this.onSwitchMode.bind(this)}
							fileType={fileType}
							onCleanUp={this.onCleanUp.bind(this)}
					onChange={onChange}/>
				</Header>
				<User user={user}
					  extend={extend}
					  onChange={onChange}/>
				
				<div className="center_frame">
					<FileList list={list} listStyle={listStyle}
							  album={album}
							  search={search}
							  user={user}
							  mode={mode}
							  selected={selected}
							  fileType={fileType}
							  onChangeAlbum={this.onChangeAlbum.bind(this)}
							  onDelete={this.onDelete.bind(this)}
							  onLimit={this.onLimit.bind(this)}
							  onInfinite={this.onInfinite.bind(this)}
							  onSelect={this.onSelect.bind(this)}
					/>
				</div>

				<Uploading data={uploading}/>
			</div>
		)
	}
}

const container =  document.getElementById("app-container")
const root = createRoot(container); 
root.render(<App />)
