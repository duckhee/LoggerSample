const express = require('express');
const router = express.Router();

const CustomerUserCtrl = require("../../../ctrl/customer/Users/user.ctrl");

router.get("/", CustomerUserCtrl.MainPage);

/**
 * Create Get Router
 */
router.get('/create', (req, res, next) => {
    /** Not Yet Need */
    res.redirect('/login');
});
/**
 * Create Post Router
 */
router.post('/create', (req, res, next) => {
    /** NOt yet Need */
    res.redirect('/login');
});

/**
 * Login Get Router
 */
router.get('/login', CustomerUserCtrl.LoginPage);
/**
 * Login Post Router
 */
router.post('/login', CustomerUserCtrl.LoginDo);

/**
 * LogOut Post Router
 */
router.post('/logout', (req, res, next) => {

});

/**
 * Profile Get Router
 */
router.get('/profile', CustomerUserCtrl.ProfilePage);

/**
 * Modify Get Router
 */
router.get('/Modify', CustomerUserCtrl.ModifyPage);

/**
 * Modify Post Router
 */
router.post('/Modify', CustomerUserCtrl.ModifyDo);





module.exports = router;