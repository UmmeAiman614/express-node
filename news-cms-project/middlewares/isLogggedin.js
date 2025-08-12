const jwt = require('jsonwebtoken')

const isLogggedin = async(req, res, next) => {
    try{
    const token = req.cookies.token
    if (!token) {
        return res.redirect('/admin/')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, tokenData) => {
        if (err) {
            return res.redirect('/admin/')
        }
        req.id = tokenData.id
        req.role = tokenData.role
        req.fullname = tokenData.fullname
        next()
    })
}catch{
    res.status(500).json({ message: error.message })
}
}

module.exports = isLogggedin