const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./auth-model')
const { checkPayloadBody, checkUsernameExists } = require('../middleware/users')
const { checkUsernameExistsLogin } = require('../middleware/auth')
const tokenBuilder = require('./tokenBuilder')

router.post('/register', checkPayloadBody, checkUsernameExists, async (req, res, next) => {
  const user = req.body
  const rounds = process.env.BCRYPT_ROUNDS || 8
  const hash = bcrypt.hashSync(user.password, rounds)

  user.password = hash

  try{
    const newUser = await Users.add(user)
    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }
});

router.post('/login', checkPayloadBody, checkUsernameExistsLogin, (req, res, next) => {
  const { username, password } = req.body

  if(bcrypt.compareSync(password, req.user.password)) {
    const token = tokenBuilder(req.user)
    res.status(200).json({
      message: `welcome, ${username}`,
      token
    })
  } else {
    next({ status: 401, message: 'invalid credentials'})
  }
});

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

module.exports = router;
