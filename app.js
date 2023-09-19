const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const campground = require('./models/campground');
const methodOverride = require('method-override');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

app.post('/campgrounds', async (req, res) => {
    const campground1 = new campground(req.body.campgroundy);
    await campground1.save();
    res.redirect(`/campgrounds/${campground1._id}`)
})


app.get('/campgrounds/new',async(req,res)=>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res,) => {
    const campground1 = await campground.findById(req.params.id);
    res.render('campgrounds/show', { campground1 });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground1 = await campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground1 });
})

app.put('/campgrounds/:id', async (req,res)=>{
    const{id} = req.params;
    const campground1 = await campground.findByIdAndUpdate(id, { ...req.body.campgroundy });
    res.redirect(`/campgrounds/${campground1._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})




app.listen(3000,()=>{
    console.log('connected to port 3000')
})