const async = require('async')

const express = require('express')
const router = express.Router()

const mysqlConfig = require('../../mysql.config')
const mysql = require('mysql')
const connection = mysql.createConnection(mysqlConfig)

const { check, validationResult } = require('express-validator/check')

// [🔒GET] 蔵書リストを取得する
router.get('/', (req, res) => {
  // res.json({
  //   status: true,
  //   message: 'Hello world!'
  // })

  let books = []
  connection.query(
    'SELECT * FROM books WHERE userId = 1',
    (err, result, fields) => {
      async.each(
        result,
        (i, callback) => {
          books.push({
            hash: i.hash,
            title: i.title,
            volume: i.volume,
            isDoujin: i.isDoujin,
            timestamp: i.timestamp
          })
          callback()
        },
        err => {
          return res.json({
            status: true,
            books
          })
        }
      )
    }
  )
})

// [🔒POST] 蔵書を登録する
router.post(
  '/',
  [
    check('title').isString(),
    check('volume').isString(),
    check('isDoujin').isInt(),
    check('remarks').isString()
  ],
  (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty) {
      return res
        .status(422)
        .json({ status: false, errors: validationErrors.array() })
    }

    const date = new Date()

    connection.query(
      'INSERT INTO books SET ?',
      {
        title: req.body.title,
        volume: req.body.volume,
        isDoujin: req.body.isDoujin,
        remarks: req.body.remarks,
        timestamp: Math.floor(date.getTime() / 1000)
      },
      (err, results) => {
        console.log(results)
        connection.query(
          'SELECT * FROM books WHERE ? LIMIT 1',
          {
            id: results.insertId
          },
          (err, results) => {
            const data = results[0]
            return res.json({
              status: true,
              hash: data.hash,
              title: data.title,
              volume: data.volume,
              timestamp: data.timestamp
            })
          }
        )
      }
    )
  }
)

// [🔒DELETE] 蔵書を削除する
router.delete('/:bookHash', [check('bookHash').isString()], (req, res) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty) {
    return res
      .status(422)
      .json({ status: false, errors: validationErrors.array() })
  }

  connection.query(
    'UPDATE books SET isDelete = 1 WHERE ?',
    {
      hash: req.params.bookHash
    },
    (err, result) => {
      return res.json({
        status: true,
        hash: req.params.bookHash
      })
    }
  )
})
module.exports = router
