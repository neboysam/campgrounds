const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Cheese = require('./models/cheese');

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

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/cheeses', async (req, res) => {
    const cheeses = await Cheese.find({});
    res.render('cheeses/index', { cheeses })
});
app.get('/cheeses/new', (req, res) => {
    res.render('cheeses/new');
})

app.post('/cheeses', async (req, res) => {
    const cheese = new Cheese(req.body.cheese);
    await cheese.save();
    res.redirect(`/cheeses/${cheese._id}`)
})

app.get('/cheeses/:id', async (req, res,) => {
    const cheese = await Cheese.findById(req.params.id)
    res.render('cheeses/show', { cheese });
});

app.get('/cheeses/:id/edit', async (req, res) => {
    const cheese = await Cheese.findById(req.params.id)
    res.render('cheeses/edit', { cheese });
})

app.put('/cheeses/:id', async (req, res) => {
    const { id } = req.params;
    const cheese = await Cheese.findByIdAndUpdate(id, { ...req.body.cheese });
    res.redirect(`/cheeses/${cheese._id}`)
});

app.delete('/cheeses/:id', async (req, res) => {
    const { id } = req.params;
    await Cheese.findByIdAndDelete(id);
    res.redirect('/cheeses');
})

app.listen(8080, () => {
    console.log('Serving on port 8080')
})