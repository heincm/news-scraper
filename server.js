const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')

// Require all models
const db = require('./models')

let PORT = process.env.PORT || 3000

// Initialize Express
const app = express()

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')))

// Set Handlebars.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Import routes and give the server access to them.
require('./routes/htmlroutes.js')(app)

// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.once('open', function () {
  console.log('we\'re connected!')
})
// app.get("/",(req, res)=>{
//   res.render("random", {title: "Phil is awesome"});
// });
app.listen(PORT, function () {
  console.log('App now listening at localhost:' + PORT)
})
