import express from 'express'
import bcrypt from 'bcryptjs'
import session from 'express-session'
import mongoose from 'mongoose'
import User from './models/user.models.js'
import e from 'express'
const app = express()


// database connection
mongoose.connect('mongodb://127.0.0.1:27017/user-crud').then(() => {
    console.log('connected');
})



//MiddleWares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}))
let checkLogin = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.redirect('login')
    }
}




app.get('/', checkLogin, (req, res) => {
    res.send(`<h1>Home Page</h1> 
        <p>Hello, ${req.session.user}</p>
        <a href = '/logout'>Logout</a>`)
})
app.get('/profile', checkLogin, (req, res) => {
    res.send(`<h1>Profile Page</h1> 
        <p>Hello, ${req.session.user}</p>
        <a href = '/logout'>Logout</a>`)
})
app.get('/login', (req, res) => {
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('login', { error: null })
    }
    
})
app.post('/login', async (req, res) => {
    const { username, userpassword } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.render('login', { error: 'User not found' })

    const isMatch = await bcrypt.compare(userpassword, user.userpassword)
    if (!isMatch) return res.render('login', { error: 'Invalid Password' })
    req.session.user = username
    res.redirect('/')
})

app.get('/register', (req, res) => {
    res.render('register', { error: null })
})
app.post('/register', async (req, res) => {
    const { username, userpassword } = req.body
    const hashedPassword = await bcrypt.hash(userpassword, 10)
    // res.send({username, userpassword: hashedPassword})
    await User.create({ username, userpassword: hashedPassword })
    res.redirect('/login')
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})









app.listen(3000, () => {
    console.log("successfully connected");
})
