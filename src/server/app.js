// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('../_config');
var cors = require('cors');
var mongoose = require('mongoose');
require('dotenv').load();

// *** Require Helpers *** //
var authHelpers = require('./routes/helpers/authHelpers');


// *** routes *** //
var meetupRoute = require('./routes/meetup.js');
var authRoute = require('./routes/auth.js');
var userRoute = require('./routes/users.js');


// *** express instance *** //
var app = express();


// *** mongo connection *** //
var environment = process.env.NODE_ENV || 'development';
var mongoURI = config.mongoURI[environment];

mongoose.connect(mongoURI, function(err, res) {
  if (err) { console.log('Error connecting to the database. ' + err); }
});


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** CORS *** //
app.use(cors());


// *** main routes *** //
app.use('/auth', authRoute);
app.use('/api', authHelpers.ensureAuthenticated);
app.use('/api/meetup', meetupRoute);
app.use('/user', authHelpers.ensureAuthenticated);
app.use('/user', userRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** Error Handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
