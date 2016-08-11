var express = require('express');
var app = express();
var path = require('path');
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var pug = require('pug');
var assert = require('assert');
var bodyParser = require('body-parser');

// app.use('/static', express.static(__dirname + '/public'));
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
  // Handler for internal server errors
  function errorHandler(err, req, res, next) {
      console.error(err.message);
      console.error(err.stack);
      res.status(500).render('error_template', { error: err });
  }

  app.get('/', function (req, res, next) {
    res.render('index');
  });

  app.post('/add_movie', function(req, res, next) {
    var title = req.body.title;
    var year = req.body.year;
    var imdb = req.body.imdb;
    if ((title == '') || (year == '') || (imdb == '')) {
      next(Error('Please provide info!'));
    }
    else {
      db.collection('movies').insertOne(
        { 'title': title, 'year': year, 'imdb': imdb },
        function (err, r) {
            assert.equal(null, err);
            res.send("Document inserted with _id: " + r.insertedId);
        }
      )
    }
  })

  app.use(errorHandler);
})


var server = app.listen(8080, function() {
  var port = server.address().port;
  console.log('Express server listening on port %s', port);
})
