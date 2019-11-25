const express = require('express');
const router = express.Router();
/** Member Controller */
const MemberCtrl = require('../../../ctrl/admin/Member/member.ctrl');
const MemberRouter = (csurfMiddleWare) => {


    /** Member Main Page */
    router.get('/', MemberCtrl.MainPage);
    /** Member Registe Page */
    router.get('/registe', csurfMiddleWare, MemberCtrl.RegistePage);
    /** Member Registe Do */
    router.post('/registe', csurfMiddleWare, MemberCtrl.RegisteDo);
    /** Registe Member Email Check */
    router.post('/userEmail-check', csurfMiddleWare, MemberCtrl.EmailCheck);
    /** Member List Page */
    router.get('/list', csurfMiddleWare, MemberCtrl.ListPage);
    /** Member Modify Page */
    router.get('/modify', csurfMiddleWare, MemberCtrl.ModifyPage);
    /** Member Modify Do */
    router.post('/modify', csurfMiddleWare, MemberCtrl.ModifyDo);
    /** Member Delete Do */
    router.post('/delete', csurfMiddleWare, MemberCtrl.DeleteDo);
    /** Member Detail Page */
    router.get('/detail', MemberCtrl.DetailPage);
    /** Member Profile Page */
    router.get('/profile', MemberCtrl.ProfilePage);
    /** Registe Member UserId Check */
    router.get('/userId-check', (req, res, next) => {
        res.json('IdCheck');
    });

    /** Registe Member UserName Check */
    router.get('/userName-check', (req, res, next) => {
        res.json('NameCheck');
    });
    /** return router */
    return router;
};

module.exports = MemberRouter;