const express = require ("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const path = require("path");

mongoose.connect('mongodb://localhost:27017/camp-db', {
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", (req, res) => {
  const camp = new Campground({title: Campground, })
});

app.listen("8080", () => {
  console.log("Server started");
});

app.get 