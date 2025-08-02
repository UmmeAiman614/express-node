import express from 'express';
import mongoose from 'mongoose'; // ✅ this line was missing
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import studentsRoutes from './routes/students-routes.js';

const app = express();

// Database Connected
mongoose.connect('mongodb://127.0.0.1:27017/students-crud')
.then(() => {
  console.log('Database connected');
})
.catch((err) => console.log('MongoDB connection error:', err));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use('/api/students', studentsRoutes);

// Error handling middleware (including multer)
app.use((err, req, res, next) => {
    // Multer file upload error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds 3MB limit.' });
    }

    if (err.message === 'Only images are allowed!') {
        return res.status(400).json({ message: 'Only image files are allowed.' });
    }

    // Generic error
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
});


// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
