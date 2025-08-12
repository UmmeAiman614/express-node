const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.redirect('/admin/dashboard');  // add return to stop further execution
    }
    next();
};

module.exports = isAdmin;
