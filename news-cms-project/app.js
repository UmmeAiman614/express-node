const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const dotenv = require('dotenv');
dotenv.config();



//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(cookieParser())
app.use(flash())
app.use(expressLayouts)
app.set('layout', './layout')
app.set('views', path.join(__dirname, 'views'))


// ejs files
app.set('view engine', 'ejs')


//database connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Database connected');
})
.catch((err) => console.log('MongoDB connection error:', err));



// routes
app.use('/',require('./routes/frontend'));

app.use('/admin', (req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
})
app.use('/admin',require('./routes/admin'));

app.listen(3000, () =>{
    console.log("successfully connected");
    
})