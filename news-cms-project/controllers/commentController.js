const commentModel = require('../models/Comment');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')


const allComments = async (req, res, next) => {
    let comments;
    if(req.role == 'admin'){
        comments = await commentModel.find()
        .populate('article',  'title' )  
        .sort({ createdAt: -1 })
    }else{
        const news= await newsModel.find({author: req.id})
        const newsIds = news.map(news => news._id)
        comments = await commentModel.find({article: {$in: newsIds}})
        .populate('article',  'title' )
        .sort({ createdAt: -1 })
    }
    // res.json(comments)
    res.render('admin/comments', {comments,role: req.role})
    if (!comments) return next(createError(404, 'No comments found'))
    
}


const updateCommentStatus = async (req, res,next) => {
    res.render('admin/comments', {role: req.role})
}
const deleteComments = async (req, res,next) => {
    res.render('admin/comments', {role: req.role})
}
module.exports = {
    allComments,
    updateCommentStatus,
    deleteComments
}