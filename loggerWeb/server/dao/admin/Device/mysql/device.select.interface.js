/** get Support Device */
const ConfigFile = require('../../../../../config/config.json');
/** Device Type Json */
const DeviceTypes = ConfigFile.supportDevice;


/** Dao Device Support Json Type */
const RawConnection = {
    "DataTracker": function() {
        console.log("Set Data-Tracker Dao");
        const DataTrackerDao = require('./DataTracker/datatracker.dao');
        return DataTrackerDao;
    },
    "ecolog": function() {
        console.log("Set Ecolog Dao");
        const EcologDao = require('./ecolog/ecolog.dao');
        return EcologDao;
    },
    "HikVision": function() {
        console.log("Set HikVision Dao");
        const HikVisionDao = require("./HikVision/HikVision.dao");
        return HikVisionDao;
    }
};

/** Dao Device Support Function Type  */
const RawDevice = (Type) => {

    if (DeviceTypes[Type] === 'DataTracker') {
        console.log("Set Data-Tracker Dao");
        const DataTrackerDao = require('./DataTracker/datatracker.dao');
        return DataTrackerDao;
    }
    if (DeviceTypes[Type] === "ecolog") {
        console.log("Set Ecolog Dao");
        const EcologDao = require('./ecolog/ecolog.dao');
        return EcologDao;
    }
    if (DeviceTypes[Type] === "HikVision") {
        console.log("Set HikVision Dao");
        const HikVisionDao = require("./HikVision/HikVision.dao");
        return HikVisionDao;
    }
    if (DeviceTypes[Type]) {
        console.log('Device Type : ', Type);

    } else {
        console.log('Failed Connection Dao Device Type : ', Type);
        return new Error("Not Support Device ", Type);
    }
};

module.exports = RawConnection;