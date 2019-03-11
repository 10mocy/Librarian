import express from 'express'
const router = express.Router()

import librarianConfig from '../../librarian.config'
import mysqlConfig from '../../mysql.config'

import mysql from 'mysql'
const pool = mysql.createPool(mysqlConfig)

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { check, validationResult } from 'express-validator/check'

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
    if (validationErrors.array().length !== 0) {
      return res
        .status(422)
        .json({ status: false, errors: validationErrors.array() })
    }

    // プールからコネクションを取得
    pool.getConnection((err, connection) => {
      // 登録しようとしているログインIDが既に存在していないかを確認する
      connection.query(
        'SELECT * FROM accounts WHERE loginId = ?',
        [req.body.loginId],
        (err, results) => {
          // 登録状態の確認
          if (results.length !== 0) {
            return res.status(403).json({
              status: false,
              errors: {
                code: '001-0002',
                enum: 'EXIST_LOGINID',
                message: '既に使用されているログインIDです'
              }
            })
          } else {
            // パスワードハッシュの生成
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
        }
      )
      connection.release()
    })
  }
)

// [POST] 認証を行う
router.post(
  '/jwt',
  [check('loginId').isAlphanumeric(), check('password').isString()],
  (req, res) => {
    const validationErrors = validationResult(req)
    if (validationErrors.array().length !== 0) {
      return res
        .status(422)
        .json({ status: false, errors: validationErrors.array() })
    }

    // パスワードハッシュの生成
    const passwordHash = crypto
      .createHash('sha512')
      .update(req.body.password)
      .digest('hex')

    pool.getConnection((err, connection) => {
      // #region 認証
      connection.query(
        'SELECT * FROM accounts WHERE loginId = ? AND password = ? LIMIT 1',
        [req.body.loginId, passwordHash],
        (err, results) => {
          // #region 認証状態確認(アカウントが存在するかどうか)
          if (results.length !== 1) {
            return res.status(403).json({
              status: false,
              errors: {
                code: '001-0001',
                enum: 'FAILED_AUTHORIZE',
                message: '認証に失敗しました。'
              }
            })
          }
          // #endregion

          const account = results[0]

          // Gravatar用IDの生成(メールアドレスのMD5ダイジェスト値)
          const gravatarId = crypto
            .createHash('md5')
            .update(account.emailAddress)
            .digest('hex')

          // JWTトークン生成
          const token = jwt.sign(
            {
              'work.neirowork.librarian.displayName': account.displayName,
              'work.neirowork.librarian.gravatarId': gravatarId,
              'work.neirowork.librarian.userHash': account.hash
            },
            librarianConfig.secret,
            {
              expiresIn: '24h'
            }
          )

          // トークン返却
          return res.json({
            status: true,
            token: token
          })
        }
      )
      // #endregion
      connection.release()
    })
  }
)

module.exports = router
