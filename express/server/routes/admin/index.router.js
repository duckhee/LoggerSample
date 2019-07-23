const express = require('express');
const router = express.Router();

/**
 * admin login check logic here.
 * if login throw next()
 * not login return login page
 */
router.get('/*', (req, res, next) => {
    console.log('login info ::: ', req.session.userInfo);
    next();
});

/**
 * admin main page /admin
 */
router.get('/', (req, res, next) => {
    console.log('admin main page !');
    res.render('admin/index', {
        login: req.session.userInfo
    });
});

module.exports = router;