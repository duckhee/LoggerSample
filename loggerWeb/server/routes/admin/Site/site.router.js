const express = require('express');
const router = express.Router();
/** Control Site Router */
const AdminSiteCtrl = require('../../../ctrl/admin/Site/site.ctrl');
/** Admin Site Main Page */
router.get('/', AdminSiteCtrl.MainPage);
/** Admin Site Create Page */
router.get('/create', AdminSiteCtrl.CreatePage);
/** Admin Site Create Do */
router.post('/create', AdminSiteCtrl.CreateDo);
/** Admin Site List Page */
router.get('/list', AdminSiteCtrl.ListPage);
/** Admin Site Detail Page */
router.get('/detail', AdminSiteCtrl.DetailPage);
/** Admin Site Modify Page */
router.get('/modify', AdminSiteCtrl.ModifyPage);
/** Admin Site Modify Do */
router.post('/modify', AdminSiteCtrl.ModifyDo);
/** Admin Site Delete Do */
router.post('/delete', AdminSiteCtrl.DeleteDo);


module.exports = router;