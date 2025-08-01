const express = require('express')
const router = express.Router()
// import Student from '../models/students.model.js'
const Student = require('./models/students.model')


//Get All students
router.get('/', async(req,res) => {
    try {
        const student = await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Get a sinle students
router.get('/:id', async(req,res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) 
           return res.status(404).json({message: 'Student not found'})
        else {
            res.json(student)    
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Add new student
router.post('/', async(req,res) => {
    try {
        const newStudent = await Student.create(req.body)
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Update a student
router.put('/:id', async(req,res) => {
    try {
        const updateStudent = await Student.findByIdAndUpdate(req.params.id, req.body,
            {new: true}
        )
        if (!updateStudent) return res.status(400).json({message: 'Student not found'})
        res.json(updateStudent)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete a student
router.put('/:id', async(req,res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id, req.body,
            {new: true}
        )
        if (!student) return res.status(404).json({message: 'Student not found'})
        res.json({message: 'Student Deleted'})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// export default router
module.exports = router;