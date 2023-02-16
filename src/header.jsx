import React from "react"


const showOpenFileDialog = () => {
    return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        //input.accept = '.txt, text/plain';
		input.multiple = true
        input.onchange = event => { resolve(event.target.files); };
        input.click();
    });
};

export default function Header(props){
	const {config, user} = props;

	const upload = async()=>{
		const files = await showOpenFileDialog()
		console.log("files", files)
		props.onUpload(files)
	}
	
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
				<button title="upload" onClick={upload}>
					<img src="./images/upload.png"/>
				</button>
			</div>
		</div>
		
	)
}
