const express = require('express');
const router = express.Router();


router.get('/list', (req, res, next) => {
    res.render('admin/logger/listPage', {
        login: req.session.userInfo
    });
});


module.exports = router;