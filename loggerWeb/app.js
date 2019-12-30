const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
/** Cross-site request forgery protection middleware */
const csurf = require('csurf');
/** security setting */
const helmet = require('helmet');

/**
 * add extra module
 */
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

/** Auth Check */

/**
 * admin router add
 */
const AdminIndexRouter = require('./server/routes/admin/index.router');

/**
 * Customer router add
 */
const CustomerIndexRouter = require('./server/routes/customer/index.router');

/**
 * Sample router add
 */
const SampleIndexRouter = require('./server/routes/Sample/sample.router');

var app = express();

/** SetUp route middleware */
const csurfMiddleWare = csurf({ key: 'secreteKeyWon', cookie: true, httpOnly: true });
//const csurfMiddleWare = csurf();
// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');
/** security helmet middleware */
app.disable('x-power-by');
app.use(helmet());
/** Security cache */
app.use(helmet.noCache());
/** Security xx filtering */
app.use(helmet.xssFilter());
/** Security */
app.use(helmet.frameguard());
/** Security */
app.use(helmet.hidePoweredBy());
/** Security */
app.use(helmet.noSniff());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secreteKeyWon'));
/** csurfMiddleWare setting */
app.use(csurfMiddleWare);



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
        name: 'SecretSession',
        secret: 'secreteKeyWon',
        key: 'secretKeyDevSession',
        saveUninitialized: true,
        unset: 'destroy',
        /* not session setting do */
        // uset: function(req) {
        //     req.session.destroy(err => {
        //         /* if session destroy Error */
        //         console.log('session destroy Error code ::: ', err.code);
        //         console.log('session destroy Error ::: ', err);
        //     });
        // },
        /* session reSave option */
        resave: true,
        cookie: {
            httpOnly: true,
            /* session alive time setting 1hour */
            /** It it make many session file ?   */
            //secure: true,
            maxAge: 1000 * 60 * 60,
        }
    })
);

/**
 * flash message use add
 */
app.use(flash());


/**
 * get file url static path
 */
app.use('/static', express.static(path.join(__dirname, 'public')));


/** Get File Url static path */
app.use('/example', express.static(path.join(__dirname, 'public/Sample')));

/**
 * Admin Router Registe
 */
//app.use('/admin', AdminIndexRouter);
AdminIndexRouter(app, csurfMiddleWare);

/**
 * Customer Router Registe
 */
CustomerIndexRouter(app, csurfMiddleWare);

/**
 * Sample Router Registe
 */
SampleIndexRouter(app, csurfMiddleWare);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error("Not Found Page");
    err.status = 404;
    console.log('404 error code ::: ', err.code);
    console.log('404 error ::: ', err);
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
    if (err.code === 'EBADCSRFTOKEN') {
        return res.render('error/403');
    }
    res.render('error/500');

});

module.exports = app;