import React from 'react'
import api from './api'
import size from './size'

function openLog(){
	let element = document.createElement('a');
	element.href = "./log/server.log"
	element.target = '_blank';
	element.click();
}

export default class ServerStatus extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			storage: null,
			memory: null,
			deleted: null,
		}
	}

	componentDidMount(){
		this.load()
	}
	async load(){
		const {storage, memory, deleted} = await api.post("getServerStatus", {})
		console.log("load", storage, memory, deleted)
		this.setState({storage, memory, deleted})
	}

	componentDidUpdate(prev){
		const {dialog} = this.props;
		if( prev.dialog !== dialog && dialog === "opened"){
			this.load()
		}
	}

	onCleanUp(){
		this.props.onCleanUp()
		this.props.close()
	}
	
	render(){
		const {dialog} = this.props;
		if( dialog !== "opened" ) return null;

		const {storage, memory, deleted} = this.state;
		if( !storage ){
			return (
				<div className="dialog server_status">
					<div className="loading_frame">
						<img id="loading" src="./images/loading.png"/>
					</div>
				</div>
			)
		}

		const cancel = (evt)=>{
			evt.stopPropagation()
		}
		
		return (
			<div className="dialog server_status" onClick={cancel}>
				<p>サーバー状況</p>
				<div className="table-container">
					<table>
						<thead>
						</thead>
						<tbody>
							<tr>
								<th>ストレージ</th>
								<td>{ size(storage.used) } / {size(storage.total)}</td>
							</tr>
							<tr>
								<th>メモリ</th>
								<td>{size(memory.used)} / {size(memory.total)}</td>
							</tr>
							<tr>
								<th>削除済みファイル</th>
								<td>{size(deleted.size)}({deleted.count}個のファイル)</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div>
					<button onClick={openLog}>ログ閲覧</button>
				</div>
				<div>
					<button onClick={this.onCleanUp.bind(this)}>クリーンアップ</button>
				</div>
				<div>
					<button onClick={()=>{this.props.close()}}>閉じる</button>
				</div>
			</div>
		)
	}
}
