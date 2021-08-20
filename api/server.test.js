// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

test('sanity', () => {
  expect(true).toBe(true)
})

test('is correct environment', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

describe('[POST] /register', () => {
  test('creates new user in db', async () => {
    await request(server).post('/api/auth/register').send({
      username: 'sandy',
      password: '1234'
    })
    expect(await db('users')).toHaveLength(4)
  })
  test('responds with id, username, password on successful register', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'sandy',
      password: '1234'
    })
    expect(res.body).toMatchObject({ id: 4, username: 'sandy' })
  })
  test('responds with [username and password required] if password missing', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'sandy'
    })
    expect(res.body.message).toBe('username and password required')
  })
})

describe('[POST] /login', () => {
  test('responds with {message: welcome, [username], token} on successful login', async () => {
    await request(server).post('/api/auth/register').send({
      username: 'sandy',
      password: '1234'
    }) 
    const res = await request(server).post('/api/auth/login').send({
      username: 'sandy',
      password: '1234'
    })
    expect(res.body.message).toBe('welcome, sandy')
  })
  test('responds with [invalid credentials] message if incorrect username', async () => {
    await request(server).post('/api/auth/register').send({
      username: 'sandy',
      password: '1234'
    }) 
    const res = await request(server).post('/api/auth/login').send({
      username: 'sand',
      password: '1234'
    })
    expect(res.body.message).toBe('invalid credentials')
  })
  test('responds with [username and password required] message if password is missing', async () => {
    const res = await request(server).post('/api/auth/login').send({
      username: 'sandy'
    })
    expect(res.body.message).toBe('username and password required')
  })
})