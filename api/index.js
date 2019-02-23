const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const booksRouter = require('./routes/books')
const accountsRouter = require('./routes/accounts')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/books', booksRouter)
app.use('/accounts', accountsRouter)

module.exports = {
  path: '/api',
  handler: app
}
