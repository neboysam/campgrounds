const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Cheese = require('./models/cheese');

mongoose.connect('mongodb://localhost:27017/cheese', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/cheeses', catchAsync(async (req, res, next) => {
    const cheeses = await Cheese.find({});
    res.render('cheeses/index', { cheeses });
}));

app.get('/cheeses/new', (req, res) => {
    res.render('cheeses/new');
})

app.post('/cheeses', catchAsync(async (req, res, next) => {
    //if(!req.body.cheese) throw new ExpressError('Invalid cheese data', 400); //if the form was not complete before sending, this will throw an error, catchAsync will catch the error with the next() function and transfer it to the error handler, l.82.
    //this is the only server-side validation we do by using the custom error handler. The second option for the server-side validation is to use JOI:
    const cheeseSchema = Joi.object({
        cheese: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    });
    //const result = cheeseSchema.validate(req.body); //'result' contains 'value' and 'error' as keys
    //console.log(result);
    const { error } = cheeseSchema.validate(req.body); //this is object destructuring
    //const { value } = cheeseSchema.validate(req.body);
    //console.log(error.details);
    if(error) {
        const msg = error.details.map(el => el.message).join(','); //map() gives undefined value
        throw new ExpressError(msg, 400);
    }
    const cheese = new Cheese(req.body.cheese);
    await cheese.save();
    res.redirect(`/cheeses/${cheese._id}`);
}));

//instead of putting try...catch into all routes, we can create a function catchAsync that would catch all the errors

app.get('/cheeses/:id', catchAsync(async (req, res, next) => {
    const cheese = await Cheese.findById(req.params.id);
    res.render('cheeses/show', { cheese });
}));

app.get('/cheeses/:id/edit', catchAsync(async (req, res, next) => {
    const cheese = await Cheese.findById(req.params.id);
    res.render('cheeses/edit', { cheese });
}));

app.put('/cheeses/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const cheese = await Cheese.findByIdAndUpdate(id, { ...req.body.cheese });
    res.redirect(`/cheeses/${cheese._id}`);
}));

app.delete('/cheeses/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Cheese.findByIdAndDelete(id);
    res.redirect('/cheeses');
}));

app.all('*', (req, res, next) => {
    //res.send('404!!!'); // for default Express error handler
    next(new ExpressError('Page Not Found', 404)); //with this set we can use our generic error handler below, l.85-86, to show this error message. In other words, we are passing 'new ExpressError(...)' to 'next()' which means it will hit the next error handler (l.82-86) and 'err' in the next error handler will be this 'new ExpressError' from l.79
});

app.use((err, req, res, next) => {
    //res.send('Something went wrong');
    const { statusCode = 404, message = 'Default message' } = err;
    /* 
    const { statusCode = 404 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err }); //sending { err } to the error template 
    */
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Serving on port 8080');
})