const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Cheese = require('../models/cheese');

mongoose.connect('mongodb://localhost:27017/cheese', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// console.log(cities.length); 471 cities in France

const seedDB = async () => {
    await Cheese.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random471 = Math.floor(Math.random() * 471);
        const price = Math.floor(Math.random() * 20) + 10;
        const cheese = new Cheese({
            location: `${cities[random471].city}, ${cities[random471].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/10560387',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await cheese.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})