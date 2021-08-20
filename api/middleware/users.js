const Users = require('../auth/auth-model')

function checkPayloadBody(req, res, next) {
    const { username, password } = req.body
    if(username && password && typeof password === "string") {
        next()
    } else {
        next({
            status: 422,
            message: "username and password required"
        })
    }
}

async function checkUsernameExists (req, res, next) {
    const { username } = req.body
    const exists = await Users.findByUsername(username)
    if(exists) {
        next({
            status: 422,
            message: "username taken"
        })
    } else {
        next()
    }
}

module.exports = {
    checkPayloadBody,
    checkUsernameExists
}