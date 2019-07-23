const express = require('express');
const router = express.Router();
const AdminLoggerCtrl = require('../../../ctrl/admin/logger/admin.logger.ctrl');

/**
 * index router /admin/logger
 */
router.get('/', AdminLoggerCtrl.IndexPage);

/**
 * logger list router /admin/logger/list
 */
router.get('/list', AdminLoggerCtrl.ListPage);

/**
 * logger insert router /admin/logger/insert
 */
router.get('/create', AdminLoggerCtrl.InsertPage);

/**
 * logger insert router post /admin/logger/insert
 */
router.post('/create', AdminLoggerCtrl.InsertDo);

/**
 * logger name check it is ftp folder name
 */
router.post('/check-name', AdminLoggerCtrl.LoggerNameCheck);

/**
 * logger modify router get /admin/logger/update
 */
router.get('/update', (req, res, next) => {
    console.log('logger update admin page show');
    res.render('admin/logger/updatePage', {
        login: req.session.userInfo
    });
});

/**
 * logger modify router post /admin/logger/update
 */
router.post('/update', (req, res, next) => {
    console.log('logger update admin post do');

});

/**
 * logger detail router get /admin/logger/detail 
 * param is no
 */
router.get('/detail', AdminLoggerCtrl.detailPage);

/**
 * logger delete post do
 */
router.post('/delete', (req, res, next) => {
    console.log('logger delete admin post do');
});




module.exports = router;