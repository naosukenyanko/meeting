import React from "react";
import ReactDOM from "react-dom";
import api from './api'
import FileList from './filelist'
import Header from './header'
console.log("app")
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
				title: "HIGASHI COMMUNITY"
			}
		}
	}

	componentDidMount(){
		this.load()
	}

	async load(){
		const result =  await api.post("getList", {})
		this.setState({list: result})
	}
	
	render() {
		const {list, listStyle, config, user} = this.state
		return (
			<div className="main_frame">
				<Header user={user} config={config}/>
				<div className="center_frame">
					<FileList list={list} listStyle={listStyle}/>
				</div>
			</div>
		)
	}
}

const container =  document.getElementById("app-container")
const root = createRoot(container); 
root.render(<App />)
