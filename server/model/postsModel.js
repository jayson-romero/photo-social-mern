import mongoose from "mongoose"

const postsModel = mongoose.Schema({
	caption: String,
	user: String,
	image: String,
})

const Posts = mongoose.model("posts", postsModel)
export default Posts
