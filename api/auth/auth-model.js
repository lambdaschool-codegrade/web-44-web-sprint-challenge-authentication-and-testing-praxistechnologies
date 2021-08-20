const db = require('../../data/dbConfig')

async function findById(id) {
    const [user] = await db('users').where('id', id)
    return user
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

async function findByUsername(username) {
    const [user] = await db('users').where('username', username)
    return user
}

module.exports = {
    add,
    findById,
    findByUsername
}