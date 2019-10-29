/**
 * Admin Login Or Admin User Do
 */
const express = require('express');
const router = express.Router();

/** Admin User Ctrl */
const AdminUserCtrl = require('../../../ctrl/admin/Users/user.ctrl');

/** Admin User Main Page */
router.get('/', AdminUserCtrl.MainPage);
/** Admin User Login  */
router.get('/login', AdminUserCtrl.LoginPage);
/** Admin User Login Do */
router.post('/login', AdminUserCtrl.LoginDo);
/** Admin User Profile Page */
router.get('/profile', AdminUserCtrl.ProfilePage);
/** Admin User Modify Page */
router.get('/modify', AdminUserCtrl.ModifyPage);
/** Admin User Modify Do */
router.post('/modify', AdminUserCtrl.ModifyDo);
/** Admin User LogOut Do */
router.post('/logout', AdminUserCtrl.LogOutDo);

module.exports = router;