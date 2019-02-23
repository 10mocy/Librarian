const async = require('async')

const express = require('express')
const router = express.Router()

const librarianConfig = require('../../librarian.config')
const mysqlConfig = require('../../mysql.config')

const mysql = require('mysql')
const connection = mysql.createConnection(mysqlConfig)

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { check, validationResult } = require('express-validator/check')

/**
 * ここから下 JWT認証必須エンドポイント
 */
router.use((req, res, next) => {
  // JWTトークンの代入
  const token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).json({
      status: false,
      errors: {
        code: '001-0003',
        enum: 'REQUIRE_AUTHENTICATION',
        message: '認証が必要です。'
      }
    })
  }

  // JWTトークンの検証
  jwt.verify(token, librarianConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        errors: {
          code: '001-0004',
          enum: 'INVALID_TOKEN',
          message: 'トークンが無効です。'
        }
      })
    }

    // 検証に成功したらここ以下の処理で使用できるようにする
    req.token = decoded
    next()
  })
})

// [🔒GET] 蔵書リストを取得する
router.get('/', (req, res) => {
  // res.json({
  //   status: true,
  //   message: 'Hello world!'
  // })

  let books = []
  connection.query(
    'SELECT * FROM books WHERE ?',
    {
      userHash: req.token['pw.neirowork.librarian.userHash']
    },
    (err, result, fields) => {
      console.log(req.token)
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
    console.log(validationErrors.array())
    if (validationErrors.array().length !== 0) {
      return res
        .status(422)
        .json({ status: false, errors: validationErrors.array() })
    }

    const date = new Date()

    console.log(req.token)

    connection.query(
      'INSERT INTO books SET ?',
      {
        title: req.body.title,
        volume: req.body.volume,
        isDoujin: req.body.isDoujin,
        remarks: req.body.remarks,
        userHash: req.token['pw.neirowork.librarian.userHash'],
        timestamp: Math.floor(date.getTime() / 1000)
      },
      (err, results) => {
        const bookId = results.insertId
        const hash = crypto
          .createHash('sha256')
          .update(String(bookId))
          .digest('hex')
        connection.query(
          'UPDATE books SET hash = ? WHERE id = ?',
          [hash, bookId],
          (err, results) => {
            connection.query(
              'SELECT * FROM books WHERE ? LIMIT 1',
              {
                id: bookId
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
  }
)

// [🔒DELETE] 蔵書を削除する
router.delete('/:bookHash', [check('bookHash').isString()], (req, res) => {
  const validationErrors = validationResult(req)
  if (validationErrors.array().length !== 0) {
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
