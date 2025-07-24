import express from 'express'
import { body, validationResult } from 'express-validator'
const app = express();

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const validationRegistration = [
    body('username')
        .notEmpty().withMessage('User Name is required')
        .isLength({ min: 3 }).withMessage('UserName must be at least 3 characters long')
        .trim()
        .isAlpha().withMessage('UserName must contain only letters'),
    body('email')
        .isEmail().withMessage('Plz provide a valid Email ID')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5, max: 5 }).withMessage('Password must be between 5 and 10 characters long')
        .isStrongPassword().withMessage('Password must be strong'),
    body('age')
        .isNumeric().withMessage('Age must be numeric')
        .isInt({ min: 18 }).withMessage('Age must be atleast 18 years old'),
    body('city')
        .isIn(['New York', 'London', 'Paris', 'Tokyo', 'Dubai']).withMessage('city must be in these cities')
]
app.get('/myForm', (req, res) => {
    res.render('myForm', {errors: 0})
})

app.post('/saveForm', validationRegistration, (req, res) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        res.send('saveForm')
    }
    res.render('myForm', {errors: error.array()})
})

app.listen(3000, () => {
    console.log('successfully connected');
})