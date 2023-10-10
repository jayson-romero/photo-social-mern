import axios from "axios"

const instance = axios.create({
	baseURL: "https://photo-social-server.onrender.com",
})

export default instance
