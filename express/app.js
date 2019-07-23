const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const logger = require('morgan');

/**
 * add module
 */
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

/**
 * router
 */
const indexRouter = require('./server/routes/index');
const UserRouter = require('./server/routes/user/user.router');
const DownloadRouter = require('./server/routes/download/download.router');
const TestingRouter = require('./server/routes/logger/logger.data.router');

/**
 * Get Json Data router
 */
const MongoRouter = require('./server/routes/mongodb/mongo.db.router');
/**
 * admin router
 */
const AdminIndexRouter = require('./server/routes/admin/index.router');
const AdminUserRouter = require('./server/routes/admin/user/admin.user.router');
const AdminLoggerRouter = require('./server/routes/admin/logger/admin.logger.router');

/**
 * db check
 */
const MongooseDB = require('./server/mongoModel/index.mongodb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser("secretkeyDev"));
//session setting save 
/**
 * store
 * key
 * resve
 * saveUninitialized
 * cookie
 * secrete
 * rolling
 * proxy
 * 
 */
app.use(
  session({
    store: new FileStore, //local file session save file
    key: 'secretekeyDevsession', //session save secrete key
    saveUninitialized: true, //
    uset: function (req) //not session setting do
    {
      req.session.destroy(function (err) {
        //if session destroy error
        console.log('session destroy error code ::: ', err.code);
        console.log('session destroy error ::: ', err);
      });
    },
    resave: false, //session resave option
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 //cookie alive time setting 1hour??
    }
  })
);

/**
 * flash message use add
 */
app.use(flash({
  unsafe: true
}));

/**
 * web resource url setting
 */
app.use('/static', express.static(path.join(__dirname, 'public')));

/**
 * router setting url
 */
app.use('/', indexRouter);
app.use('/member', UserRouter);
app.use('/download', DownloadRouter);
app.use('/test', TestingRouter);

/**
 * Get Json Data Setting
 */
app.use('/Json', MongoRouter);

/**
 * Admin router setting url
 */
app.use('/admin', AdminIndexRouter);
app.use('/admin/member', AdminUserRouter);
app.use('/admin/logger', AdminLoggerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  res.render('error/404');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('server error code ::: ', err.code);
  console.log('server error :::: ', err);
  res.render('error/500');
});

module.exports = app;