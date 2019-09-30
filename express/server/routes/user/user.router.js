const express = require('express');
const router = express.Router();
const UserCtrl = require('../../ctrl/user/user.ctrl');

router.get('/', (req, res, next)=>{
    res.render('user/index');
});

router.get('/login', UserCtrl.LoginPage);

router.post('/login', UserCtrl.LoginDo);

router.post('/logout', UserCtrl.LogoutDo);



module.exports = router;