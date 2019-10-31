const express = require('express');
const router = express.Router();

const CustomerDashBoardCtrl = require('../../../../ctrl/customer/Device/DashBoard/dashboard.ctrl');

router.get('/', (req, res, next) => {
    res.render('CustomerPages/DevicePages/DashBoard/indexPage');
});

module.exports = router;