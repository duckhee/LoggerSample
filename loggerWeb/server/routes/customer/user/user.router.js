const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    console.log('customer Main Page');
    res.redirect('/login');
});

/**
 * Create Get Router
 */
router.get('/create', (req, res, next) => {

});
/**
 * Create Post Router
 */
router.post('/create', (req, res, next) => {

});

/**
 * Login Get Router
 */
router.get('/login', (req, res, next) => {
    res.render('CustomerPages/Users/Login/LoginPage');
});
/**
 * Login Post Router
 */
router.post('/login', (req, res, next) => {

});

/**
 * Profile Get Router
 */
router.get('/profile', (req, res, next) => {

});





module.exports = router;