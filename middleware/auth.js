const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    } catch {
        return res.sendStatus(500)
    }
}