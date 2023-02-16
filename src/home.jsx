import React from "react";
import ReactDOM from "react-dom";
import api from './api'
import FileList from './filelist'
import Header from './header'
import Uploading from './uploading'

import "./theme.scss"

import { createRoot } from 'react-dom/client';

export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			user: null,
			list: null,
			listStyle: "large",
			config: {
				name: "HIGASHI COMMUNITY"
			},
			uploading: null,
		}
	}

	componentDidMount(){
		this.load()
	}

	async load(){
		const config = await api.post("getConf", {})
		const list = await api.post("getList", {})
		this.setState({list, config})
	}

	async upload(files){
		console.log("upload", files)
		for(let i=0; i<files.length ; i++){
			const file = files[0]
			console.log("upload", file)
			const ops = {albumid: 1, name: "guest"}
			const progress = (evt)=>{
				console.log("proc", evt)
				
				this.setState({
					uploading: {file, progress: evt}
				})
			}
			const proc = await api.upload( file, ops, progress )
		}
		this.setState({uploading: null})
	}
	
	render() {
		const {list, listStyle, config, user, uploading} = this.state
		return (
			<div className="main_frame">
				<Header user={user} config={config}
						onUpload={this.upload.bind(this)}/>
				<div className="center_frame">
					<FileList list={list} listStyle={listStyle}/>
				</div>

				<Uploading data={uploading}/>
			</div>
		)
	}
}

const container =  document.getElementById("app-container")
const root = createRoot(container); 
root.render(<App />)
