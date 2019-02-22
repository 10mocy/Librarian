const express = require('express')
const app = express()

const booksRouter = require('./routes/books')

app.use('/books', booksRouter)

module.exports = {
  path: '/api',
  handler: app
}
