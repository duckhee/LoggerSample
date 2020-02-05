const DataTracker = require('./DataTracker/index.dao');
const Ecolog = require('./Ecolog/index.dao');

/** Check Device */
const CheckDevice = () => {
    console.log("INTERFACE SELECTOR");
    let _return = {
        "DataTracker": DataTracker.CheckDataTracker,
        "ecolog": Ecolog.CheckEcolog
    };
    return _return;
};

/** Check Name Column DataTracker Need */
const InsertName = () => {
    let _return = {
        "DataTracker": DataTracker.InsertDataTrackerName,
        "ecolog": "",
        "HikVision": ''
    };
    return _return;
};
/** Insert Data */
const InsertData = () => {
    let _return = {
        "DataTracker": DataTracker.InsertDataTrackerData,
        "ecolog": Ecolog.InsertEcologData,
        "HikVision": ''
    };
    return _return;
};

/** All Do */
const _DoWork = () => {
    let _return = {
        "DataTracker": '',
        "ecolog": Ecolog.AllDo
    };
    return _return;
};

module.exports = {
    CheckDevice,
    InsertName,
    InsertData,
    _DoWork
};