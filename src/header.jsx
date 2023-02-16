import React from "react"


export default function Header(props){
	const {config, user} = props;
	return (
		<div className="header">
			<div className="title">{config.title}</div>
			
		</div>
	)
}
