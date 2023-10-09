import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import ConnectDB from "./config/db.js"
import Posts from "./model/postsModel.js"

// App Config
dotenv.config()
const app = express()
const port = process.env.PORT || 9000

//DB configuration
app.use(express.json())
ConnectDB()

//Middle configuration
app.use(cors())

// API Endpoints
app.get("/", (req, res) => {
	res.status(200).send("Welcome API")
})

app.post("/upload", async (req, res) => {
	const dbPost = req.body
	try {
		const response = await Posts.create(dbPost)
		res.status(200).send(response)
	} catch (error) {
		res.status(500).send(error)
		console.log(error.message)
	}
})

app.get("/sync", async (req, res) => {
	try {
		const response = await Posts.find()
		res.status(200).send(response)
	} catch (error) {
		res.status(500).send(error)
		console.log(error.message)
	}
})

//App Listener
app.listen(port, () => console.log(`listening on ${port}`))
