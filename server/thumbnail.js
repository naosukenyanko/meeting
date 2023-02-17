const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises
const path = require('path')

module.exports = async function(file, hash){
	const ext = path.extname(file.originalname).toLowerCase()

	const movie = [".mp4", ".mov"]
	const image = [".png", ".gif", ".jpg", ".jpeg", ".ico"]
	if( movie.includes(ext) ){

		const command = ffmpeg(file.path);
		const thumbnail = path.join("./thumbnail", hash +  ".png")	
		await new Promise( (resolve)=>{
			command.screenshots({
				count: 1,
				folder: "./",
				filename: thumbnail,
				size: '320x?' // 幅320で縦は可変
				
			}).on("end" , ()=>{
				resolve()
			});

		})

		return thumbnail
		
	}else if( image.includes(ext) ){
		const thumbnail = path.join("./thumbnail", hash +  ext)	
		await fs.copyFile(file.path, thumbnail)
		return thumbnail
	}
	
	return ""
}
