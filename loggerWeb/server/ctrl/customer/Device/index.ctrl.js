const AlarmCtrl = require('./Alarm/alarm.ctrl');
const MapCtrl = require('./Map/map.ctrl');
const DashBoardCtrl = require('./DashBoard/dashboard.ctrl');

/** Export Customer Controller */
const Module = {
    Map: MapCtrl,
    Alarm: AlarmCtrl,
    DashBoard: DashBoardCtrl
};

module.exports = Module;