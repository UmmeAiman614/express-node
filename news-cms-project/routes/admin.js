const express = require('express');
const router = express.Router();
const { loginPage, adminLogin, logout, dashboard, settings, saveSettings } = require('../controllers/userController');
const { allUsers, addUserPage, addUser, updateUserPage, updateUser, deleteUser } = require('../controllers/userController');
const { allCategory, addCategoryPage, addCategory, updateCategoryPage, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { allArticle, addArticlePage, addArticle, updateArticlePage, updateArticle, deleteArticle } = require('../controllers/articleController');
const { allComments,updateCommentStatus, deleteComments } = require('../controllers/commentController');
const isLogggedin = require('../middlewares/isLogggedin')
const isAdmin = require('../middlewares/isAdmin')
const upload = require('../middlewares/multer')
const isValid = require('../middlewares/validation')



// Login Routes
router.get('/', loginPage);
router.post('/index',isValid.loginValidation, adminLogin);
router.get('/logout', logout);
router.get('/dashboard', isLogggedin, dashboard);
router.get('/settings', isLogggedin, isAdmin, settings);
router.post('/save-settings', isLogggedin, isAdmin, upload.single('website_logo'), saveSettings);





// User CRUD Routes
router.get('/users', isLogggedin, isAdmin, allUsers);
router.get('/add-user', isLogggedin, isAdmin, addUserPage);
router.post('/add-user', isLogggedin, isAdmin, isValid.userValidation, addUser);
router.get('/update-user/:id', isLogggedin, isAdmin, updateUserPage);
router.post('/update-user/:id', isLogggedin, isAdmin, isValid.userUpdateValidation, updateUser);
router.delete('/delete-user/:id', isLogggedin, isAdmin, deleteUser);


// Category CRUD Routes
router.get('/category', isLogggedin, isAdmin, allCategory);
router.get('/add-category', isLogggedin, isAdmin, addCategoryPage);
router.post('/add-category', isLogggedin, isAdmin, isValid.categoryValidation, addCategory);
router.get('/update-category/:id', isLogggedin, isAdmin, updateCategoryPage);
router.post('/update-category/:id', isLogggedin, isAdmin, isValid.categoryValidation, updateCategory);
router.delete('/delete-category/:id', isLogggedin, isAdmin, deleteCategory);


// Article CRUD Routes
router.get('/article', isLogggedin, allArticle);
router.get('/add-article', isLogggedin, addArticlePage);
router.post('/add-article', isLogggedin, upload.single('image'), isValid.articleValidation, addArticle);
router.get('/update-article/:id', isLogggedin, updateArticlePage);
router.post('/update-article/:id', isLogggedin, upload.single('image'), isValid.articleValidation, updateArticle);
router.delete('/delete-article/:id', isLogggedin, deleteArticle);


//Comment routes
router.get('/comment', isLogggedin, allComments);
router.put('/update-comment-status/:id', isLogggedin, updateCommentStatus);
router.delete('/delete-comment', isLogggedin, deleteComments);


// 404 Middleware
router.use(isLogggedin, (req, res, next) => {
    res.status(404).render('admin/404', {
        message: 'Page not found',
        role: req.role
    });
});

// 500 error handler
router.use(isLogggedin, (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500
    let view;
    switch (status) {
        case 401:
            view = 'admin/401';
            break;
        case 404:
            view = 'admin/404';
            break;
        case 500:
            view = 'admin/500';
            break;
        default:
            view = 'admin/500';
    }
    res.status(status).render(view, {
        message: err.message || 'something went wrong',
        role: req.role
    });
});

module.exports = router


