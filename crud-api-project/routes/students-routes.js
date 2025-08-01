import express from 'express'
import Student from '../models/students-models.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
const router = express.Router()
// const Student = require('./models/students.model')

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
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }
    else {
        cb(new Error('Only images are allowed!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 3
    }
})


//Get All students
router.get('/', async (req, res) => {
    try {
        const student = await Student.find()
        res.json(student)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get a sinle students
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student)
            return res.status(404).json({ message: 'Student not found' })
        else {
            res.json(student)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Add new student
router.post('/', upload.single('profile_pic'), async (req, res) => {
    try {
        // const newStudent = await Student.create(req.body)
        const student = new Student(req.body)
        if (req.file) {
            student.profile_pic = req.file.filename
        }
        const newStudent = await student.save()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update a student
router.put('/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate ID format first
        if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
            if (req.file) {
                const newFilePath = path.join('./uploads', req.file.filename);
                fs.unlink(newFilePath, (err) => {
                    if (err) console.log('Failed to delete uploaded image for invalid ID:', err);
                });
            }
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        const existingStudent = await Student.findById(studentId);
        if (!existingStudent) {
            if (req.file) {
                const newFilePath = path.join('./uploads', req.file.filename);
                fs.unlink(newFilePath, (err) => {
                    if (err) console.log('Failed to delete uploaded image:', err);
                });
            }
            return res.status(404).json({ message: 'Student not found' });
        }

        // Handle profile_pic update
        if (req.file) {
            if (existingStudent.profile_pic) {
                const oldImagePath = path.join('./uploads', existingStudent.profile_pic);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log('Failed to delete old image:', err);
                });
            }
            req.body.profile_pic = req.file.filename;
        }

        // Update student
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            req.body,
            { new: true }
        );

        res.json(updatedStudent);

    } catch (error) {
        // Delete file if error occurred and file was uploaded
        if (req.file) {
            const filePath = path.join('./uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.log('Failed to delete image after error:', err);
            });
        }

        res.status(500).json({ message: error.message });
    }
});



//Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id, req.body,
            { new: true }
        )
        if (!student) return res.status(404).json({ message: 'Student not found' })
        if (student.profile_pic) {
            const filePath = path.join('./uploads', student.profile_pic)
            fs.unlink(filePath, (err) => {
                if (err) console.log('failed to delete: ', err);

            })
        }
        res.json({ message: 'Student Deleted' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router