import express from 'express'
import cookieParser from 'cookie-parser'
const app = express()

//middlewares
// app.use(express.urlencoded({extended: false}))
// app.use(app.use(express.json()))
// app.use('view engine', 'ejs')
app.use(cookieParser('mySecretKey123'))



app.get('/', (req,res) => {
    const home = '<h1>Home page</h1>'
        const username = req.cookies.username;
    if(!username){
        res.send(`${home}: No cookie found`)
    }
    res.send(`${home} Cookie found: ${username}`)
})
app.get('/set-cookie', (req,res) => {
    res.cookie('username', 'Umme Aiman', {
        maxAge: 900000,
        httpOnly: true,
        signed:true,
    })
    res.send('<h1>Cookie has been set</h1>')
})
app.get('/get-cookie', (req,res) => {
    const username = req.signedCookies.username;
    if(!username){
        res.send(`No cookie found`)
    }
    res.send(`Cookie found: ${username}`)
})
app.get('/delete-cookie', (req,res) => {
    res.clearCookie('username')
    res.send('<h1>Cookie has been deleted</h1>')
})






app.listen(3000, () => {
    console.log('Successfully connected');
    
})