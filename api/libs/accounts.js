/* データベース設定 */
import mysql from 'mysql'
import mysqlConfig from '../../mysql.config'
const pool = mysql.createPool(mysqlConfig)

export const hasExistLoginId = loginId =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'SELECT * FROM accounts WHERE loginId = ?',
        [loginId],
        (err, results) => {
          connection.release()
          if (err) {
            return reject(err)
          }
          if (results.length !== 0) {
            return resolve(false)
          }
          return resolve(true)
        }
      )
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
        return reject(err)
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
          connection.release()
          if (err) {
            return reject(err)
          }

          return resolve(results.insertId)
        }
      )
    })
  })

export const setUserHash = (userId, userHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'UPDATE accounts SET hash = ? WHERE id = ?',
        [userHash, userId],
        err => {
          connection.release()
          if (err) {
            return reject(err)
          }

          return resolve(true)
        }
      )
    })
  })

export const auth = (loginId, passwordHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'SELECT * FROM accounts WHERE loginId = ? AND password = ? LIMIT 1',
        [loginId, passwordHash],
        (err, results) => {
          connection.release()
          if (err) {
            return reject(err)
          }

          if (results.length !== 1) {
            return resolve(false)
          }

          return resolve(results[0])
        }
      )
    })
  })

export default {
  hasExistLoginId,
  createAccount,
  setUserHash,
  auth
}
