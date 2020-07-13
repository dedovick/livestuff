const passport = require('passport')  
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)

var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var twitchRouter = require('./routes/twitch');
var youtubeRouter = require('./routes/youtube');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./auth')(passport);
app.use(session({  
  store: new MongoStore({
	url: process.env.MONGO_CONNECTION,
    db: global.db,
    ttl: 30 * 60 // = 30 minutos de sessão
  }),
  secret: '1!\/&$tufF',
  resave: false,
  saveUninitialized: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'TEST123', resave: false, saveUninitialized: false}));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/', twitchRouter);
app.use('/', youtubeRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
