import React from "react"


export default function Header(props){
	const {config, user} = props;
	return (
		<div className="header">
			<div className="title">{config.name}</div>
			<div className="size_buttons">
				<button>large</button>
				<button>medium</button>
				<button>small</button>
			</div>

			<div className="album">
				<button title="アルバム切り替え">HOME</button>
			</div>
			<div className="upload">
				<button title="upload">
					<img src="./images/upload.png"/>
				</button>
			</div>
		</div>
		
	)
}
