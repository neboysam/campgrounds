const mongoose = require("mongoose");

const CheeseSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

module.exports = Cheese;