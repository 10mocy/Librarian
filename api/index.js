const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const booksRouter = require('./routes/books')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/books', booksRouter)

module.exports = {
  path: '/api',
  handler: app
}
