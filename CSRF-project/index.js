import express from 'express'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
const app = express()

app.use(cookieParser())
const csrfProtection = csrf({cookie: true})

//middlewares
app.use(express.urlencoded({extended: false}))
app.use((express.json()))
app.set('view engine', 'ejs')

app.get('/', (req,res) =>{
    res.send(`<h1>Home Page</h1>`)
})
app.get('/myForm',csrfProtection, (req,res) =>{
    res.render('myForm', {csrfToken: req.csrfToken()})
})
app.post('/submit',csrfProtection, (req,res) =>{
    res.send(req.body)
})

app.listen(3000, () =>{
    console.log('Successfully Conected');
    
})