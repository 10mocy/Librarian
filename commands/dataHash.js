const crypto = require('crypto')

const mysqlConfig = require('../mysql.config')
const mysql = require('mysql')
const connection = mysql.createConnection(mysqlConfig)

connection.query('SELECT * FROM books', (err, results) => {
  results.forEach(i => {
    // console.log(i)
    const hash = crypto
      .createHash('sha256')
      .update(String(i.id))
      .digest('hex')
    connection.query(
      'UPDATE books SET hash = ? WHERE id = ?',
      [hash, i.id],
      (err, results) => {
        console.log(`${i.id} --> ${hash}`)
      }
    )
  })
})
