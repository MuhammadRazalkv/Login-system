// Mongoose connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/user_login')

const express = require('express')
const app = express()

const nocache = require("nocache");

app.use(nocache())


//  User route
const userroute = require('./routes/userRout')
app.use('/', userroute)

// admin Route
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute )




app.listen(3000, () => {
  console.log('server running on http://localhost:3000')
})
