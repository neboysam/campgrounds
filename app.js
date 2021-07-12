const express = require ("express");
const mongoose = require("mongoose");
const Cheese = require("./models/cheese");
const path = require("path");

mongoose.connect('mongodb://localhost:27017/cheese', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
  res.render("home");
});

/* app.get("/makecheese", async (req, res) => {
  const camp = new Cheese({title: "Cheese", price: "15.59"});
  await camp.save();
  res.send(camp);
}); */

//INDEX route with all cheeses
app.get("/cheeses", async (req, res) => {
  const cheeses = await Cheese.find({});
  res.render("./cheeses/index", {cheeses: cheeses}); //or just, { cheeses }
});

//NEW route
app.get("/cheeses/new", (req, res) => {
  res.render("cheeses/new");
});

//POST route
app.post("/cheeses", async (req, res) => {
  const cheeseBody = req.body.cheese;
  /* const cheese = new Cheese(cheeseBody);
  await cheese.save(); */
  const cheese = await Cheese.create(cheeseBody);
  res.redirect(`/cheeses/${cheese._id}`);
});

//SHOW route
app.get("/cheeses/:id", async (req, res) => {
  const id = req.params.id;
  const cheese = await Cheese.findById(id);
  res.render("cheeses/show", { cheese: cheese });
});

app.listen("8080", () => {
  console.log("Server started");
});

app.get 