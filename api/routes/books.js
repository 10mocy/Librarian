const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Hello world!'
  })
})

module.exports = router
