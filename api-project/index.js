const express = require('express')
const app = express()
import studentsRoutes from './routes/students-routes.js'
// const studentsRoutes = require('./routes/students-routes');


//Database Connected
mongoose.connect('mongodb://127.0.0.1:27017/students-crud')
.then(() =>{
    console.log('database connected');
})
.catch((err => console.log(err)))

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/api/students', studentsRoutes)


app.listen(3000, () =>{
    console.log('Successfully connected');  
})

