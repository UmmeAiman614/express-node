const express = require('express');
const router = express.Router();
const loadCommonData = require('../middlewares/loadCommonData')

const { index, articleByCategories, singleArticle, search, author, addComment } = require('../controllers/sideController');


router .use(loadCommonData);
router.get('/', index);
router.get('/category/:name', articleByCategories);
router.get('/category/:name/:id', singleArticle);
router.get('/search', search);
router.get('/author/:name', author);
router.post('/article/:id/comment', singleArticle);



module.exports = router



