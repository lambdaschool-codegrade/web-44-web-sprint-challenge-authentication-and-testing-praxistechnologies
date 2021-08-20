const Users = require('../auth/auth-model')

async function checkUsernameExistsLogin (req, res, next) {
    const { username } = req.body
    const user = await Users.findByUsername(username)
    if(user) {
        req.user = user
        next()
    } else {
        next({
            status: 401,
            message: 'invalid credentials'
        })
    }
}

module.exports = {
    checkUsernameExistsLogin
}