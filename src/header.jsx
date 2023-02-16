import React from "react"


export default function Header(props){
	const {config, user} = props;
	return (
		<div className="header">
			<div className="title">{config.title}</div>
			<div className="size_buttons">
				<button>large</button>
				<button>medium</button>
				<button>small</button>
			</div>
			<div>
				<input className="search_text" type="text" placeholder="(検索)"/>
			</div>
			<div className="upload">
				<button title="upload">+</button>
			</div>
		</div>
		
	)
}
