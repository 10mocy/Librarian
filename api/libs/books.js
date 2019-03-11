import async from 'async'

/* データベース設定 */
import mysql from 'mysql'
import mysqlConfig from '../../mysql.config'
const pool = mysql.createPool(mysqlConfig)

export const get = (userHash, bookHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'SELECT * FROM books WHERE hash = ? AND userHash = ? LIMIT 1',
        [bookHash, userHash],
        (err, result) => {
          connection.release()
          if (err) {
            return reject(err)
          }

          if (result.length === 0) {
            return resolve(false)
          }

          const data = result[0]
          return resolve({
            hash: data.hash,
            title: data.title,
            volume: data.volume,
            isDoujin: data.isDoujin,
            remarks: data.remarks,
            timestamp: data.timestamp
          })
        }
      )
    })
  })

export const getAll = userHash =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'SELECT * FROM books WHERE ? AND isDelete = 0 ORDER BY id DESC',
        {
          userHash
        },
        (err, result) => {
          connection.release()
          if (err) {
            return reject(err)
          }

          let books = []
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
              return resolve(books)
            }
          )
        }
      )
    })
  })

export const search = (userHash, query) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'SELECT * FROM books WHERE ( title LIKE ? OR remarks LIKE ? ) AND userHash = ? AND isDelete = 0 ORDER BY id DESC',
        [`%${query}%`, `%${query}%`, userHash],
        (err, results) => {
          connection.release()
          if (err) {
            return reject(err)
          }

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
              return resolve(books)
            }
          )
        }
      )
    })
  })

export const create = (userHash, title, volume, isDoujin, remarks) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.release()
      if (err) {
        return reject(err)
      }

      const date = new Date()

      connection.query(
        'INSERT INTO books SET ?',
        {
          title,
          volume,
          isDoujin,
          remarks,
          userHash,
          timestamp: Math.floor(date.getTime() / 1000)
        },
        (err, results) => {
          if (err) {
            return reject(err)
          }
          return resolve(results.insertId)
        }
      )
    })
  })

export const setHash = (bookId, bookHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'UPDATE books SET hash = ? WHERE id = ?',
        [bookHash, bookId],
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

export const remove = (userHash, bookHash) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }

      connection.query(
        'UPDATE books SET isDelete = 1 WHERE hash = ? AND userHash = ?',
        [bookHash, userHash],
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

export default {
  get,
  getAll,
  search,
  setHash,
  remove
}
