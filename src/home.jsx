import React from "react";
import ReactDOM from "react-dom";
import api from './api'
import FileList from './filelist'
import Header from './header'
import Uploading from './uploading'
import storage from './storage'
import User from './user'
import "./theme.scss"

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
		const config = await api.post("getConf", {})
		const list = await api.post("getList", {})
		this.setState({list, config})
	}

	async upload(files){
		const {album, user} = this.state;
		console.log("upload", files)
		for(let i=0; i<files.length ; i++){
			const file = files[0]
			console.log("upload", file)
			const ops = {
				album: album,
				userName: user || "guest",
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
		const result = await api.post("changeAlbum", {
			id: file.id,
			album: name,
		})
		await this.load();
	}

	async onDelete(file){
		const result = await api.post("deleteFile", {id: file.id})
		await this.load();
	}

	async onInfinite(file){
		const result = await api.post("setExpires", {
			id: file.id,
			expires: null,
		})
		await this.load();
	}

	async onLimit(file){
		const result = await api.post("setExpires", {
			id: file.id,
			expires: getExpire(1)
		})
		await this.load();		
	}
		
	
	render(){
		const onChange = (obj)=>{
			this.setState(obj)
		}
		const {list, listStyle, config, user, uploading} = this.state
		const {album, albumList} = this.state;
		
		return (
			<div className="main_frame">
				<Header user={user} config={config}
						listStyle={listStyle}
						list={list}
						album={album}
						onChange={onChange}
						onUpload={this.upload.bind(this)}/>
				<User user={user}
					  onChange={onChange}/>
				<div className="center_frame">
					<FileList list={list} listStyle={listStyle}
							  album={album}
							  onChangeAlbum={this.onChangeAlbum.bind(this)}
							  onDelete={this.onDelete.bind(this)}
							  onLimit={this.onLimit.bind(this)}
							  onInfinite={this.onInfinite.bind(this)}
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
