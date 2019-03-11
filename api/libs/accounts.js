import crypto from 'crypto'

/* データベース設定 */
import mysql from 'mysql'
import mysqlConfig from '../../mysql.config'
const pool = mysql.createPool(mysqlConfig)

export const hasExistLoginId = loginId =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }

      connection.query(
        'SELECT * FROM accounts WHERE loginId = ?',
        [loginId],
        (err, results) => {
          if (err) {
            reject(err)
          }
          if (results.length !== 0) {
            resolve(false)
          }
          resolve(true)
        }
      )
      connection.release()
    })
  })

export const createAccount = (
  loginId,
  passwordHash,
  emailAddress,
  displayName
) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }

      connection.query(
        'INSERT INTO accounts SET ?',
        {
          loginId,
          password: passwordHash,
          emailAddress,
          displayName
        },
        (err, results) => {
          if (err) {
            reject(err)
          }

          resolve(results.insertId)
        }
      )
      connection.release()
    })
  })

export const setUserHash = (userId, userHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }

      connection.query(
        'UPDATE accounts SET hash = ? WHERE id = ?',
        [userHash, userId],
        err => {
          if (err) {
            reject(err)
          }

          resolve(true)
        }
      )
      connection.release()
    })
  })

export default {
  hasExistLoginId,
  createAccount,
  setUserHash
}
