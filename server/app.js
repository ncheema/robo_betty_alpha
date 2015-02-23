'use strict';

/*
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var path = require('path');
var mongoose = require('mongoose');

var passport = require('passport');
var flash = require('connect-flash')
/*
 * MongoDb configuration.
 */
var config = require('../server/config/config.js');

/*
 * Create Express server.
 */
var app = express();

/*
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
mongoose.connection.on('connected', function() {
  console.log('MongoDB connected succesfully at: ' + config.mongoDBUrl);
});

mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

require('../server/config/passport')(passport); // pass passport for configuration


/*
 * Express configuration.
 */
app.set('port', config.port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));


/*
*
* required for passport
*/
app.use(session({ secret: 'roboBettyAdmin' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('../server/routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
//so auth can use the passport 




/*
 * Add in our routes
 */
var home = require('./routes/home');

app.use(home);


/*
 * Error Handler.
 */
app.use(errorHandler());

/*
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', 
    app.get('port'), 
    app.get('env'));
});

module.exports = app;
