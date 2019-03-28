const db = require('../models')
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = function (app) {
  // Load index page
  app.get('/', function (req, res) {
    res.render('index')
  })

  // A GET route for scraping the echoJS website
  app.get('/scrape', function (req, res) {
  // First, we grab the body of the html with axios
    axios.get('https://politics.theonion.com/').then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data)

      // Now, we grab every h1 within a class of headline, and do the following:
      $('h1.js_entry-title').each(function (i, element) {
      // Save an empty result object
        var result = {}

        console.log(result)

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children('a')
          .text()
        result.link = $(this)
          .children('a')
          .attr('href')

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
          // View the added result in the console
            console.log(dbArticle)
          })
          .catch(function (err) {
          // If an error occurred, log it
            console.log(err)
          })
      })

      // Send a message to the client
      res.send('Scrape Complete')
    })
  })

  // Route for getting all Articles from the db
  app.get('/articles', function (req, res) {
  // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
      // If an error occurred, send it to the client
        res.json(err)
      })
  })

  // Render 404 page for any unmatched routes
  app.get('*', function (req, res) {
    res.render('404')
  })
}
