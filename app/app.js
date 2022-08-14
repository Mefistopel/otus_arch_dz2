const express = require('express')
const app = express()
const port = 8000

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})