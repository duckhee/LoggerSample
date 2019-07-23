const express = require('express');
const router = express.Router();
const AdminUserCtrl = require('../../../ctrl/admin/user/admin.user.ctrl');

/**
 * index page admin member /admin/member
 */
router.get('/', (req, res, next) => {
    console.log('admin member main page redirect /member/list');
    res.redirect('/admin/member/list');
});

/**
 * list page admin member /admin/member/list
 */
router.get('/list', AdminUserCtrl.UserListPagingSearchPage);

/**
 * insert user page admin member /admin/member/create
 */
router.get('/create', AdminUserCtrl.InsertPage);

/**
 * insert user admin member/admin/member/create
 */
router.post('/create', AdminUserCtrl.InsertDo);

/**
 * insert user admin check user id
 */
router.post('/user-idCheck', AdminUserCtrl.UserIdCheck);

/**
 * detail user admin 
 */
router.get('/detail', AdminUserCtrl.UserDetailPage);

/**
 * update user admin check user id
 */
router.get('/update', AdminUserCtrl.UserUpdatePage);


module.exports = router;