var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , expressSession = require('express-session')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
var app = express();

var connectToDb = require('./connection')
  , index = require('./routes/index')
  , users = require('./routes/users')
  , login = require('./routes/login')
  , signup = require('./routes/signup')
  , logout = require('./routes/logout')
  , search = require('./routes/search')
  , update_num_going = require('./routes/update_num_going')
  , User = require('./models/user');



/******************************************************************************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'adAIKBd2C5xlVSunLGdP',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//verify user
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({name: username}, function(err, user){
      if (err) throw err;
      if (!user){
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.check_pass(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      } 
      return done(null, { id: user._id, name: user.name });
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user) {
    if (err) throw err;
    done(null, { id: user._id, name: user.name });
  });
});

/******************************************************************************/
//routes
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/search', search);
app.use('/update_num_going', update_num_going);



/******************************************************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

connectToDb();

module.exports = app;
