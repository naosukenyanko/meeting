import React, {useState} from "react"
import AlbumDialog from './albumdialog'
import storage from './storage'
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

function SizeButtons(props){
	const {listStyle} = props;
	const list = ["large", "medium", "small"].map( (item, i)=>{
		const onClick = ()=>{
			storage.set("listStyle", item)
			props.onChange({listStyle: item})
		}
		const className = item === listStyle ? "selected": "";
		return (
			<button onClick={onClick} key={item} className={className}>
				{item}
			</button>
		)
	})
	return (
		<div className="size_buttons">
			{list}
		</div>
	)
}

export default function Header(props){
	const {config, user} = props;

	const upload = async()=>{
		const files = await showOpenFileDialog()
		console.log("files", files)
		props.onUpload(files)
	}

	const [dialog, setDialog] = useState("closed")
	const onClickAlbum = ()=>{
		setDialog("opened")
	}
	const close = ()=>{
		setDialog("clsoe")
	}
	
	return (
		<div className="header">
			<div className="title">{config.name}</div>

			<div className="frame">

				<div className="left_frame">
					
					<SizeButtons {...props}/>
					
					<div className="album">
						<button title="アルバム切り替え"
								onClick={onClickAlbum}
						>
							{props.album || "home"}
						</button>
					</div>
					<div className="upload">
						<button title="upload" onClick={upload}>
							<img src="./images/upload.png"/>
							
						</button>
					</div>
					<AlbumDialog dialog={dialog} {...props} close={close}/>
				</div>
				
				{props.children}
			</div>
		</div>
		
	)
}
