const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/**
 * add extra module
 */
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

/** Auth Check */

/**
 * db connection check
 */
const MongooseDB = require('./server/mongoModel/index.mongodb');


/**
 * admin router add
 */
const AdminIndexRouter = require('./server/routes/admin/index.router');

/**
 * Customer router add
 */
const CustomerIndexRouter = require('./server/routes/customer/index.router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secreteKeyWon'));

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
        /* local file session save file */
        store: new FileStore,
        /* session save secrete key */
        key: 'secretKeyDevSession',
        saveUninitialized: true,
        /* not session setting do */
        uset: function(req) {
            req.session.destroy(err => {
                /* if session destroy Error */
                console.log('session destroy Error code ::: ', err.code);
                console.log('session destroy Error ::: ', err);
            });
        },
        /* session reSave option */
        resave: false,
        cookie: {
            httpOnly: true,
            /* session alive time setting 1hour */
            maxAge: 1000 * 60 * 60,
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
 * get file url static path
 */
app.use('/static', express.static(path.join(__dirname, 'public')));


/**
 * Admin Router Registe
 */
//app.use('/admin', AdminIndexRouter);
AdminIndexRouter(app);

/**
 * Customer Router Registe
 */
//app.use('/', CustomerIndexRouter);
CustomerIndexRouter(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error("Not Found Page");
    err.status = 404;
    res.render('error/404');
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log('server error code ::: ', err.code);
    console.log('server error ::: ', err);
    res.render('error/500');

});

module.exports = app;