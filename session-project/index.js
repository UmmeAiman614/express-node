import MongoStore from 'connect-mongo'
import express from 'express'
import session from 'express-session'
const app = express()


app.use(session({
    secret: 'secretPassword',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.
        create(
            {
                mongoUrl: 'mongodb://127.0.0.1:27017/sessiondb',
                collectionName: 'mySessions',
                // ttl: 1000 * 60 * 60 * 24
            }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`<h1>UserName from session ${req.session.username}</h1>`)
    }
    else {
        res.send(`<h1>No username has been found</h1>`)

    }
})

app.get('/set-username', (req, res) => {
    req.session.username = "UmmeAiman"
    res.send('<h1>UserName has been set in session</h1>')
})

app.get('/get-username', (req, res) => {
    if (req.session.username) {
        res.send(`<h1>UserName from session ${req.session.username}</h1>`)
    }
    else {
        res.send(`<h1>No username has been found</h1>`)

    }

})

app.get('/destroy', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send(`error in destroying`)
        }
        res.send(`<h1>session successfully destroyed</h1>`)

    })

})

app.listen(3000, () => {
    console.log('server succesfully connected');
})