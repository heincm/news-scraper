const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')

// Require all models
const db = require('./models')

let PORT = process.env.PORT || 3000

// Initialize Express
const app = express()

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')))

// Use this to override the Post method as a Put method with form submission
app.use(methodOverride('_method'))

// Set Handlebars.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Import routes and give the server access to them.
require('./routes/htmlroutes.js')(app)

// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.once('open', function () {
  console.log('we\'re connected!')
})

app.listen(PORT, function () {
  console.log('App now listening at localhost:' + PORT)
})
