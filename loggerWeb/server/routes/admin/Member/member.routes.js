const express = require('express');
const router = express.Router();
/** Member Controller */
const MemberCtrl = require('../../../ctrl/admin/Member/member.ctrl');

/** Member Main Page */
router.get('/', MemberCtrl.MainPage);
/** Member Registe Page */
router.get('/registe', MemberCtrl.RegistePage);
/** Member Registe Do */
router.post('/registe', MemberCtrl.RegisteDo);
/** Member List Page */
router.get('/list', MemberCtrl.ListPage);
/** Member Modify Page */
router.get('/modify', MemberCtrl.ModifyPage);
/** Member Modify Do */
router.post('/modify', MemberCtrl.ModifyDo);
/** Member Delete page */
router.get('/delete', MemberCtrl.DeletePage);
/** Member Delete Do */
router.post('/delete', MemberCtrl.DeleteDo);
/** Member Profile Page */
router.get('/profile', MemberCtrl.ProfilePage);
/** Registe Member UserId Check */
router.get('/userId-check', (req, res, next) => {
    next();
});
/** Registe Member Email Check */
router.get('/userEmail-check', (req, res, next) => {

});
/** Registe Member UserName Check */
router.get('/userName-check', (req, res, next) => {

});


module.exports = router;