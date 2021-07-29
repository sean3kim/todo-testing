const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/todo");


const app = express();


const dbURL = process.env.DB_URL || "mongodb://localhost:27017/todo-testing";
mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
	const todoToSend = await Todo.find();
	res.json({ ...todoToSend });
})

app.post("/", async (req, res) => {
	const incomingTodo = new Todo(req.body);
	await incomingTodo.save();
	res.json(incomingTodo)
})

app.delete("/", async (req, res) => {
	const { id } = req.body;
	await Todo.findByIdAndDelete(id);
	res.send("deleted")
})

app.put("/", async (req, res) => {
	const { _id, text } = req.body;
	console.log(req.body)
	const editTodo = await Todo.findByIdAndUpdate(_id, { text: text }, { new: true });
	console.log(editTodo)
	res.json(editTodo);
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`serving on port ${port}`);
})
