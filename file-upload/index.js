import multer, { MulterError } from 'multer'
import path from 'path'
import express from 'express'
import { error } from 'console'
import { name } from 'ejs'
const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname)
        cb(null, newFileName)
    }
})
const fileFilter = (req, file, cb) => {
    // (file.mimetype.startsWith("image/"))
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpeg") {
        cb(null, true)
    }
    else {
        cb(new Error('only images are allowed'), false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3,
    },
    fileFilter: fileFilter
})


app.get('/', (req, res) => {
    res.render('myForm')
})
//upload a single file

// app.post('/submitForm', upload.single('file'), (req, res) => {
//     if (!req.file || req.file.length == 0) {
//         return res.status(400).send(`No file uploaded`)
//     }
//     res.send(req.file.filename);
// }, (error, req, res, next) => {
//     if (error instanceof multer.MulterError) {
//         return res.status(400).send(`multer error: ${error.message}`)
//     }
//     else if (error) {
//         return res.status(500).send(`Something went wrong: ${error.message}`)

//     }
//     next()
// }) 
//OR we can handle error middleware like this

// app.use((error, req, res, next) => {
//     if (error instanceof multer.MulterError) {
//         return res.status(400).send(`multer error: ${error.message}`)
//     }
//     else if (error) {
//         return res.status(500).send(`Something went wrong: ${error.message}`)

//     }
//     next()
// })


//uploading a multiple files
// app.post('/submitForm', upload.array('file', 3), (req, res) => {
//     if (!req.files || req.files.length == 0) {
//         return res.status(400).send(`No file uploaded`)
//     }
//     res.send(req.files);
// })


// uploading a two fields
app.post('/submitForm', upload.fields([
    {name: 'file', maxCount: 3},
    {name: 'filedocs', maxCount:1}
]), (req, res) => {
    if (!req.files || req.files.length == 0) {
        return res.status(400).send(`No file uploaded`)
    }
    res.send(req.files);
})

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if(error.code == 'LIMIT_UNEXPECTED_FILE'){
        return res.status(400).send(`Error: Too many files uploaded`)
        }
        return res.status(400).send(`multer error: ${error.message} : ${error.code}`)
    }
    else if (error) {
        return res.status(500).send(`Something went wrong: ${error.message}`)

    }
    next()
})


app.listen(3000, () => {
    console.log('server successfully connected');

})