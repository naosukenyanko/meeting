import React from 'react'
import api from './api'
import size from './size'

export default class ServerStatus extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			storage: null,
			memory: null,
		}
	}

	componentDidMount(){
		this.load()
	}
	async load(){
		const {storage, memory} = await api.post("getServerStatus", {})
		console.log("load", storage, memory)
		this.setState({storage, memory})
	}

	render(){
		const {dialog} = this.props;
		if( dialog !== "opened" ) return null;

		const {storage, memory} = this.state;
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
					</tbody>
				</table>

				<div>
					<button>ログ閲覧</button>
				</div>
				<div>
					<button>クリーンアップ</button>
				</div>
				<div>
					<button onClick={()=>{this.props.close()}}>閉じる</button>
				</div>
			</div>
		)
	}
}
