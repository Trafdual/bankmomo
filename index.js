const express = require('express')
const bodyParser = require('body-parser')
const naprouter = require('./router/naprouter')
const ruttienrouter = require('./router/rutroutes')

const methodOverride = require('method-override')
const cors = require('cors')

var app = express()
app.use(methodOverride('_method'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use('/', naprouter)
app.use('/', ruttienrouter)

const port = process.env.PORT || 3500

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})

app.listen(port, () => {
  try {
    console.log('kết nối thành công 3500')
  } catch (error) {
    console.log('kết nối thất bại 3500', error)
  }
})
