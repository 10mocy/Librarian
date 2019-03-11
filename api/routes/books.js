import async from 'async'

import express from 'express'
const router = express.Router()

import librarianConfig from '../../librarian.config'
import mysqlConfig from '../../mysql.config'

import mysql from 'mysql'
const pool = mysql.createPool(mysqlConfig)

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { check, validationResult } from 'express-validator/check'

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

  pool.getConnection((err, connection) => {
    let books = []
    // ユーザハッシュから蔵書データを取得
    connection.query(
      'SELECT * FROM books WHERE ? AND isDelete = 0 ORDER BY id DESC',
      {
        userHash: req.token['work.neirowork.librarian.userHash']
      },
      (err, result, fields) => {
        // 返却データの作成
        async.each(
          result,
          (i, callback) => {
            books.push({
              hash: i.hash,
              title: i.title,
              volume: i.volume,
              isDoujin: i.isDoujin,
              remarks: i.remarks,
              timestamp: i.timestamp
            })
            callback()
          },
          err => {
            // 返却
            return res.json({
              status: true,
              books
            })
          }
        )
      }
    )
    connection.release()
  })
})

// [🔒POST] 蔵書を検索する
router.post('/search', [check('query').isString()], (req, res) => {
  const validationErrors = validationResult(req)
  if (validationErrors.array().length !== 0) {
    return res
      .status(422)
      .json({ status: false, errors: validationErrors.array() })
  }

  pool.getConnection((err, connection) => {
    // 検索クエリでタイトルと備考を検索する。(削除済みは無視)
    connection.query(
      'SELECT * FROM books WHERE ( title LIKE ? OR remarks LIKE ? ) AND userHash = ? AND isDelete = 0 ORDER BY id DESC',
      [
        `%${req.body.query}%`,
        `%${req.body.query}%`,
        req.token['work.neirowork.librarian.userHash']
      ],
      (err, results) => {
        // 返却データの作成
        let books = []
        async.each(
          results,
          (i, callback) => {
            books.push({
              hash: i.hash,
              title: i.title,
              volume: i.volume,
              isDoujin: i.isDoujin,
              remarks: i.remarks,
              timestamp: i.timestamp
            })
            callback()
          },
          err => {
            // 返却
            return res.json({
              status: true,
              books
            })
          }
        )
      }
    )
    connection.release()
  })
})

// [🔒POST] 蔵書を登録する
router.post(
  '/',
  [
    check('title')
      .isString()
      .not()
      .isEmpty(),
    check('volume')
      .isString()
      .not()
      .isEmpty(),
    check('isDoujin')
      .isInt()
      .not()
      .isEmpty(),
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

    pool.getConnection((err, connection) => {
      // 蔵書の登録
      connection.query(
        'INSERT INTO books SET ?',
        {
          title: req.body.title,
          volume: req.body.volume,
          isDoujin: req.body.isDoujin,
          remarks: req.body.remarks,
          userHash: req.token['work.neirowork.librarian.userHash'],
          timestamp: Math.floor(date.getTime() / 1000)
        },
        (err, results) => {
          // 蔵書IDの代入
          const bookId = results.insertId

          // 蔵書IDからダイジェスト値を作成
          const hash = crypto
            .createHash('sha256')
            .update(String(bookId))
            .digest('hex')

          // 蔵書ハッシュ値を適用
          connection.query(
            'UPDATE books SET hash = ? WHERE id = ?',
            [hash, bookId],
            (err, results) => {
              // 蔵書の最終的な情報を取得
              connection.query(
                'SELECT * FROM books WHERE ? LIMIT 1',
                {
                  id: bookId
                },
                (err, results) => {
                  // 登録情報をレスポンス
                  const data = results[0]
                  return res.json({
                    status: true,
                    hash: data.hash,
                    title: data.title,
                    volume: data.volume,
                    remarks: data.remarks,
                    timestamp: data.timestamp
                  })
                }
              )
            }
          )
        }
      )
      connection.release()
    })
  }
)

// [🔒GET] 蔵書情報を取得する
router.get('/:bookHash', [check('bookHash').isString()], (req, res) => {
  const validationErrors = validationResult(req)
  if (validationErrors.array().length !== 0) {
    return res
      .status(422)
      .json({ status: false, errors: validationErrors.array() })
  }

  pool.getConnection((err, connection) => {
    connection.query(
      'SELECT * FROM books WHERE hash = ? AND isDelete = 0 AND userHash = ?',
      [req.params.bookHash, req.token['work.neirowork.librarian.userHash']],
      (err, results) => {
        if (results.length === 0) {
          return res.status(404).json({
            status: false,
            errors: {
              code: '002-0001',
              enum: 'BOOK_NOT_FOUND',
              message: '指定された蔵書が見つかりません。'
            }
          })
        } else {
          const book = results[0]
          return res.json({
            status: true,
            book: {
              title: book.title,
              volume: book.volume,
              isDoujin: book.isDoujin,
              remarks: book.remarks,
              timestamp: book.timestamp
            }
          })
        }
      }
    )
    connection.release()
  })
})

// [🔒DELETE] 蔵書を削除する
router.delete('/:bookHash', [check('bookHash').isString()], (req, res) => {
  const validationErrors = validationResult(req)
  if (validationErrors.array().length !== 0) {
    return res
      .status(422)
      .json({ status: false, errors: validationErrors.array() })
  }

  const bookHash = req.params.bookHash

  pool.getConnection((err, connection) => {
    // 蔵書データの確認
    connection.query(
      'SELECT * FROM books WHERE ? AND isDelete = 0',
      {
        hash: bookHash
      },
      (err, results) => {
        // 蔵書が見つからなかったとき
        if (results.length === 0) {
          return res.status(404).json({
            status: false,
            errors: {
              code: '002-0001',
              enum: 'BOOK_NOT_FOUND',
              message: '指定された蔵書が見つかりません。'
            }
          })
        } else {
          // 削除フラグを立てる
          connection.query(
            'UPDATE books SET isDelete = 1 WHERE ?',
            {
              hash: bookHash
            },
            (err, results) => {
              // レスポンス
              return res.json({
                status: true,
                hash: bookHash
              })
            }
          )
        }
      }
    )
    connection.release()
  })
})

export default router
