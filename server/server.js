import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import Pusher from "pusher"
import mongoose from "mongoose"
import ConnectDB from "./config/db.js"
import Posts from "./model/postsModel.js"

// App Config
dotenv.config()
const app = express()
const port = process.env.PORT || 9000
// Pusher Config
const pusher = new Pusher({
	appId: process.env.PUSHER_APPID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: "ap1",
	useTLS: true,
})

//DB configuration
ConnectDB()

//Middle configuration
app.use(express.json())
app.use(cors())

const db = mongoose.connection
db.once("open", () => {
	console.log("DB Connected")
	const msgCollection = db.collection("posts")
	const changeStream = msgCollection.watch()
	changeStream.on("change", (change) => {
		console.log(change)
		if (change.operationType === "insert") {
			console.log("Triggering Pusher")
			pusher.trigger("posts", "inserted", {
				change: change,
			})
		} else {
			console.log("Error trigerring Pusher")
		}
	})
})
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
