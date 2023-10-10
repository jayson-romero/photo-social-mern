import "./ImageUpload.css"
import { useState } from "react"
import axios from "../../axios.js"

import { storage, ref, uploadBytes, getDownloadURL } from "../../firebase"

const ImageUpload = ({ username }) => {
	const [image, setImage] = useState(null)
	const [progress, setProgress] = useState(0)
	const [caption, setCaption] = useState("")

	const [url, setUrl] = useState("")

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0])
		}
	}

	const handleUpload = async () => {
		if (image == null) return
		try {
			const imageRef = ref(storage, `images/${image.name}`)
			const result = await uploadBytes(imageRef, image)
			const url = await getDownloadURL(result.ref)
			if (url) {
				try {
					setUrl(url)
					const response = await axios.post("/upload", {
						caption: caption,
						user: username,
						image: url,
					})
					if (response) {
						alert("post upload success")
						setProgress(0)
						setImage(null)
						setCaption("")
					}
				} catch (error) {
					console.log(error)
				}
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div className="imageUpload">
			<progress className="imageUpload__progress" value={progress} max="100" />
			<input
				type="text"
				placeholder="Enter a caption..."
				className="imageUpload__input"
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
			/>
			<input
				className="imageUpload__file"
				type="file"
				onChange={handleChange}
			/>
			<button className="imageUpload__button" onClick={handleUpload}>
				Upload
			</button>
		</div>
	)
}

export default ImageUpload
