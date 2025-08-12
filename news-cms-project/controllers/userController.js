const userModel = require('../models/User');
const categoryModel = require('../models/Category');
const articleModel = require('../models/News');
const settingModal = require('../models/settings');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const { validationResult } = require('express-validator')
const createError = require('../utils/error-message')
const fs = require('fs')

const loginPage = async (req, res) => {
    res.render('admin/login', {
        layout: false,
        errors: 0
    })
}
const adminLogin = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('admin/login', {
            layout: false,
            errors: errors.array()
        })
    }


    const { username, password } = req.body
    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            // return res.status(404).send('Invalid username or password')
            return next(createError('Invalid username or password', 401))

        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            // return res.status(400).send('Invalid username or password')
            return next(createError('Invalid username or password', 401))
        }
        const jwData = { id: user._id, fullname: user.fullname, role: user.role }
        const token = jwt.sign(jwData, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        })
        res.redirect('/admin/dashboard')
    }

    catch (error) {
        // return res.status(500).json({ message: error.message })
        next(error)
    }
}
const logout = async (req, res) => {
    res.clearCookie('token')
    res.redirect('/admin/')
}

const dashboard = async (req, res, next) => {
    try {
        let articles;
        if (req.role == 'author') {
            articles = await articleModel.countDocuments({ author: req.id })
        } else {
            articles = await articleModel.countDocuments()
        }
        const categories = await categoryModel.countDocuments()
        const users = await userModel.countDocuments()
        res.render('admin/dashboard', {
            role: req.role,
            fullname: req.fullname,
            articles, categories, users
        })
    } catch (error) {
        // return res.status(500).json({ message: error.message })
        next(error)
    }
}
const settings = async (req, res, next) => {
    try {
        const settings = await settingModal.findOne();
        res.render('admin/settings', {
            role: req.role,
            settings: settings || {} // ✅ Ensure it's always defined
        });
    } catch (error) {
        // return res.status(500).json({ message: error.message });
        next(error)
    }
};


const saveSettings = async (req, res, next) => {
    const { website_title, footer_description } = req.body;
    const website_logo = req.file?.filename;

    try {
        const settings = await settingModal.findOne({}) || new settingModal();
        settings.website_title = website_title;
        settings.footer_description = footer_description;
        if (website_logo) {
            if(settings.website_logo){
                const logoPath = `./public/uploads/${settings.website_logo}`;
                if (fs.existsSync(logoPath)) {
                    fs.unlinkSync(logoPath);
                }
            }
            settings.website_logo = website_logo;
        }
        await settings.save();

        res.redirect('/admin/settings')

    } catch (error) {
        // return res.status(500).json({message: error.message})
        next(error)
    }

}

const allUsers = async (req, res) => {
    const users = await userModel.find()
    res.render('admin/users', { users, role: req.role })
}
const addUserPage = async (req, res) => {
    res.render('admin/users/create', { role: req.role, errors: 0 })
}
const addUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('admin/users/create', {
            role: req.role,
            errors: errors.array()
        })
    }
    await userModel.create(req.body)
    res.redirect('/admin/users')
}
const updateUserPage = async (req, res, next) => {
    const id = req.params.id
    try {
        const user = await userModel.findById(id)
        res.render('admin/users/update', { user, role: req.role, errors: 0 })
        if (!user) {
            // return res.status(404).json({ message: 'User not found' })
            return next(createError('User not found', 404))
        }
    } catch (error) {
        // return res.status(500).json({ message: error.message })
        next(error)
    }

}
const updateUser = async (req, res, next) => {
    const id = req.params.id

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('admin/users/update', {
            user: req.body,
            role: req.role,
            errors: errors.array()
        })
    }
    const { fullname, password, role } = req.body
    try {
        const user = await userModel.findById(id)
        res.redirect('/admin/users')
        if (!user) {
            // return res.status(404).json({ message: 'User not found' })
            return next(createError('User not found', 404))
        }

        user.fullname = fullname || user.fullname
        if (password) {
            user.password = password
        }
        user.role = role || user.role
        await user.save()
        res.redirect('/admin/users')

    } catch (error) {
        // return res.status(500).json({ message: error.message })
        next(error)
    }
}
const deleteUser = async (req, res, next) => {
    const id = req.params.id
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return next(createError('User not found', 404));
        }
        const article = await articleModel.findOne({ author: id })
        if (article) {
            return res.status(400).json({ success: false, message: 'User is associated with articles' })
        }
        await user.deleteOne();
        res.json({ success: true });
    } catch (error) {
        next(error)
    }
}





module.exports = {
    loginPage,
    adminLogin,
    logout,
    dashboard,
    settings,
    saveSettings,
    allUsers,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
}