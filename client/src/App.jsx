import { useEffect, useState } from "react"
import "./App.css"
import Post from "./components/Post/Post"
import ImageUpload from "./components/ImageUpload/ImageUpload"
import LoadingComponent from "./components/Loading/LoadingComponent"
import ErrorComponent from "./components/Error/ErrorComponent"

import axios from "./axios.js"
import Pusher from "pusher-js"

import {
	auth,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "./firebase.js"

import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
}

function App() {
	const [open, setOpen] = useState(false)
	const [openSignIn, setOpenSignIn] = useState(false)
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const [user, setUser] = useState({})

	// UserEffect for getting user
	useEffect(() => {
		onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser)
				if (user) {
					console.log(user)
				}
			} else {
				setUser(null)
			}
		})
	}, [user, username])

	const signUp = async (e) => {
		e.preventDefault()
		try {
			const userCred = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			if (userCred) {
				setOpen(false)
				console.log(userCred)
			}
		} catch (error) {
			alert(error.message)
		}
	}

	const signIn = async (e) => {
		e.preventDefault()
		try {
			const userCred = await signInWithEmailAndPassword(auth, email, password)
			if (userCred) {
				setOpenSignIn(false)
				console.log(userCred)
			}
		} catch (error) {
			alert(error.message)
		}
	}

	// FETCH POSTS FUNCTION
	const fetchPosts = async () => {
		setLoading(true)
		try {
			const response = await axios.get("/sync")
			setPosts(response.data)
			setLoading(false)
		} catch (error) {
			console.log(error.message)
			setLoading(false)
			setError(error.message)
		}
	}

	//FETCH POSTS
	useEffect(() => {
		fetchPosts()
	}, [])

	// USEEFFECT FOR PUSHER
	useEffect(() => {
		const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
			cluster: "ap1",
		})
		const channel = pusher.subscribe("posts")
		channel.bind("inserted", (data) => {
			fetchPosts()
		})
		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	}, [])

	if (loading) {
		return <LoadingComponent />
	}
	if (error) {
		return <ErrorComponent message={error} />
	}

	return (
		<div className="app">
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://banner2.cleanpng.com/20180720/zia/kisspng-react-javascript-library-web-development-vue-js-funding-icon-5b51604fbf7995.0841849115320597277843.jpg"
								alt="Header"
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</Box>
			</Modal>
			<Modal
				open={openSignIn}
				onClose={() => setOpenSignIn(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://banner2.cleanpng.com/20180720/zia/kisspng-react-javascript-library-web-development-vue-js-funding-icon-5b51604fbf7995.0841849115320597277843.jpg"
								alt="Header"
							/>
						</center>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</Box>
			</Modal>

			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://banner2.cleanpng.com/20180720/zia/kisspng-react-javascript-library-web-development-vue-js-funding-icon-5b51604fbf7995.0841849115320597277843.jpg"
					alt="Header"
				/>

				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>

			<div className="app__posts">
				{posts &&
					posts.map((post) => (
						<Post
							key={post._id}
							username={post.user}
							caption={post.caption}
							imageUrl={post.image}
						/>
					))}
			</div>
			{user?.email ? (
				<ImageUpload username={user.email} />
			) : (
				<h3 className="app__notLogin">Need to login to upload</h3>
			)}
		</div>
	)
}

export default App
