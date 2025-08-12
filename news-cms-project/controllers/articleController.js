const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const fs = require('fs')
const path = require('path')
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')

const allArticle = async (req, res, next) => {
    try {
        let articles;
        if (req.role == 'admin') {
            articles = await newsModel.find().populate('category', 'name').populate('author', 'fullname')
        } else {
            articles = await newsModel.find({ author: req.id }).populate('category', 'name').populate('author', 'fullname')

        }
        res.render('admin/articles', { role: req.role, articles })
    } catch (error) {
        // req.status(500).send('Server Error')
        // res.redirect('/admin/dashboard')
        next(error)
    }
}
const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find()
    res.render('admin/articles/create', { categories, role: req.role,errors:0 })

}
const addArticle = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const categories = await categoryModel.find()
        return res.render('admin/articles/create', {
            role: req.role,
            errors: errors.array(),
            categories
        })
    }
    const { title, content, category } = req.body
    const image = req.file
    if (!image) {
        req.flash('error', 'Please upload an image')
        return res.redirect('/admin/add-article')
    }
    const news = new newsModel({
        title,
        content,
        category,
        image: image.filename,
        author: req.id
    })
    try {
        await news.save()
        res.redirect('/admin/article')
    } catch (error) {
        // req.flash('error', 'Something went wrong')
        // res.redirect('/admin/add-article')
        next(error)
    }
}
const updateArticlePage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const article = await newsModel.findById(id).populate('category', 'name').populate('author', 'fullname');
        if (!article) {
            // req.flash('error', 'Article not found');
            // return res.redirect('/admin/article');
            return next(createError('Article not found', 404))
        }

        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return next(createError('You are not authorized to update this article', 401))
            }
        }

        const categories = await categoryModel.find();
        res.render('admin/articles/update', { role: req.role, article, categories, errors: 0 });
    } catch (error) {
        // req.flash('error', 'Something went wrong');
        // res.redirect('/admin/article');
        next(error)
    }

}
const updateArticle = async (req, res, next) => {
    const id = req.params.id;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const categories = await categoryModel.find()
        return res.render('admin/articles/update', {
            categories,
            article: req.body,
            role: req.role,
            errors: errors.array()
        })
    }
    const { title, content, category } = req.body;
    const image = req.file;
    try {
        const article = await newsModel.findById(id);
        if (!article) {
            // req.flash('error', 'Article not found');
            // return res.redirect('/admin/article');
            return next(createError('Article not found', 404))
           
        }
        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return next(createError('You are not authorized to update this article', 401))
            }
        }
        article.title = title;
        article.content = content;
        article.category = category;
        if (image) {
            const imagePath = path.join(__dirname, '../public/uploads', article.image);
            fs.unlinkSync(imagePath);
            article.image = image.filename;
        }
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        // req.flash('error', 'Something went wrong');
        // res.redirect('/admin/article');
        next(error)
    }
}
const deleteArticle = async (req, res, next) => {
    try {
        const id = req.params.id;
        const article = await newsModel.findById(id);
        if (!article) {
            // req.flash('error', 'Article not found');
            // return res.redirect('/admin/article');
            return next(createError('Article not found', 404))
        }
        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return next(createError('You are not authorized to delete this article', 401))
            }
        }
        try {
            const imagePath = path.join(__dirname, '../public/uploads', article.image);
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.log('Failed to delete old image:', error);
        }
        await article.deleteOne();
        res.json({ success: true })
    } catch (error) {
        // req.flash('error', 'Something went wrong');
        // res.redirect('/admin/article');
        next(error)
    }
}


module.exports = {
    allArticle,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
}