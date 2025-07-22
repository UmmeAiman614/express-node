const express = require('express');
const mongoose = require('mongoose')
const app = express();
const Contact = require('./models/contacts.modals.js'); // Import the contact model

//database connection
mongoose.connect('mongodb://127.0.0.1:27017/contacts-crud')
.then(() => {
    console.log('database connected');
    
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//midleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));   
app.use(express.static('public'));


//Routes
app.get('/', async (req, res) => {
    const contacts = await Contact.find(); // Fetch all contacts from the database
    // res.json(contacts); // Send contacts as JSON response
    res.render('home', {contacts}); // Render home view with contacts data
});

app.get('/show-contact/:id', async(req, res) => {
    const contact = await Contact.findById(req.params.id); // Find contact by ID
    res.render('show-contact', {contact}); // Assuming contacts is an empty array for now
});

app.get('/add-contact', (req, res) => {
    res.render('add-contact');
});

app.post('/add-contact', async(req, res) => {
const contact = await Contact.create(req.body)
    res.redirect('/')
});

app.get('/update-contact/:id', async(req, res) => {
    const contact = await Contact.findById(req.params.id); // Find contact by ID
    res.render('update-contact', {contact}); // Assuming we will pass contact data later
});

app.post('/update-contact/:id', async(req, res) => {
    await Contact.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/')
});

app.get('/delete-contact/:id', async(req, res) => {
    await Contact.findByIdAndDelete(req.params.id)
    res.redirect('/')
});


