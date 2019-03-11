import express from 'express'
const app = express()

import bodyParser from 'body-parser'

import booksRouter from './routes/books'
import accountsRouter from './routes/accounts'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/books', booksRouter)
app.use('/accounts', accountsRouter)

module.exports = {
  path: '/api',
  handler: app
}
