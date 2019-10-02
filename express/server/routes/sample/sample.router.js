const express = require('express');
const router = express.Router();
const SampleCtrl = require('../../ctrl/sample/sample.ctrl');

/**
 * Sample One Page
 */
router.get('/', SampleCtrl.SamplePage);

/**
 * Sample Cell One
 */
router.get('/cellOne', SampleCtrl.CellOnePage);

/**
 * Sample Cell Two
 */
router.get('/cellTwo', SampleCtrl.CellTwoPage);

/**
 * Sample Cell Three
 */
router.get('/cellThree', SampleCtrl.CellThreePage);

/**
 * Get Main Web Data
 */
router.get('/DeviceData', SampleCtrl.GetDeviceData);

/**
 * Get Main Web Image
 */
router.get('/DeviceImage', SampleCtrl.GetImagePath);

/**
 * Get file Image Test get ftp server
 */



module.exports = router;