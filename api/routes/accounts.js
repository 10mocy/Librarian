const express = require('express')
const router = express.Router()

const mysqlConfig = require('../../mysql.config')
const mysql = require('mysql')
const connection = mysql.createConnection(mysqlConfig)

const crypto = require('crypto')
const { check, validationResult } = require('express-validator/check')

// [POST] アカウントを作成する
router.post(
  '/',
  [
    check('loginId').isAlphanumeric(),
    check('password').isString(),
    check('emailAddress').isEmail(),
    check('displayName').isString()
  ],
  (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty) {
      return res
        .status(422)
        .json({ status: false, errors: validationErrors.array() })
    }

    // パスワードハッシュの作成
    const passwordHash = crypto
      .createHash('sha512')
      .update(req.body.password)
      .digest('hex')

    connection.query(
      'INSERT INTO accounts SET ?',
      {
        loginId: req.body.loginId,
        password: passwordHash,
        emailAddress: req.body.emailAddress,
        displayName: req.body.displayName
      },
      (err, results) => {
        // ユーザIDの取得
        const userId = results.insertId

        //ユーザIDからユーザハッシュを作成
        const userHash = crypto
          .createHash('sha256')
          .update(String(userId))
          .digest('hex')

        // #region ユーザハッシュ適用
        connection.query(
          'UPDATE accounts SET hash = ? WHERE id = ?',
          [userHash, results.insertId],
          (err, results) => {
            // #region 最終的なユーザ情報取得
            connection.query(
              'SELECT * FROM accounts WHERE id = ?',
              [userId],
              (err, results) => {
                // レスポンス
                return res.json({
                  status: true,
                  hash: userHash
                })
              }
            )
            // #endregion
          }
        )
        // #endregion
      }
    )
  }
)
module.exports = router
