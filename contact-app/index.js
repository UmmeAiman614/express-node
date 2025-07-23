import express from 'express';
const app = express();
import contactsRoutes from './routes/contacts.routes.js'; // Import the contacts routes
import { connectDB } from './config/database.js'; // Import the database connection function
const PORT = process.env.PORT // Set the port from environment variable or default to 3000

//database connection
connectDB(); // Connect to the database


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//midleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));   
app.use(express.static('public'));

//routes
app.use("/" ,contactsRoutes); // Use the contacts routes