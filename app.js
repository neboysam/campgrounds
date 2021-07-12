const express = require ("express");
const mongoose = require("mongoose");
const Cheese = require("./models/cheese");
const methodOverride = require("method-override");
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
mongoose.set('useFindAndModify', false);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

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

//EDIT form
app.get("/cheeses/:id/edit", async (req, res) => {
  const { id } = req.params;
  const cheese = await Cheese.findById(id);
  res.render("cheeses/edit", { cheese });
});

//UPDATE route
app.put("/cheeses/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCheese = req.body.cheese;
  const cheese = await Cheese.findByIdAndUpdate(id, { ...updatedCheese });
  res.redirect(`/cheeses/${cheese._id}`);
});

app.listen("8080", () => {
  console.log("Server started");
});