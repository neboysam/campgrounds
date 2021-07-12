const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Cheese = require("../models/cheese");

mongoose.connect('mongodb://localhost:27017/cheese', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

/* const seedDB = async () => {
  await Cheese.deleteMany({});
  const cheese = new Cheese({title: "Tomme de brebis", description: "Fromage de brebis"});
  await cheese.save();
} */

const sample = (array) => array[Math.floor(Math.random() * array.length)];

/* This is the same function definition as above:
const sample = array => array[Math.floor(Math.random() * array.length)];
*/

const seedDB = async () => {
  await Cheese.deleteMany({});
  for(let i = 0; i < 50; i++) {
    const random470 = Math.floor(Math.random() * 470);
    //console.log(cities[random470].city);
    const cheese = new Cheese({
      location: `${cities[random470].city}, ${cities[random470].admin_name}`,
      title: `${sample(descriptors)} - ${sample(places)}`
      /* title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} - ${places[Math.floor(Math.random() * places.length)]}` */
    });
    await cheese.save();
  }
}

seedDB();