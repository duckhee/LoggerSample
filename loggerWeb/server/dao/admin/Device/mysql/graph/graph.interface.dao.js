/** get Support Device */
const ConfigFile = require('../../../../../../config/config.json');
/** Device Dao */
const Dao = require('../../index.dao');
const AdminDeviceDao = Dao();

const GraphSelect = {
    "DataTracker": function() {
        console.log("Select Data-Tracker Dao");
        const DataTrackerGraphDao = require('./DataTracker/DataTracker.graph');
        return DataTrackerGraphDao;
    },
    "ecolog": function() {
        console.log("Select Ecolog");
        const EcologGraphDao = require('./Ecolog/ecolog.graph');
        return EcologGraphDao;
    }
};

const GraphSelector = (no) => {
    console.log("Device Type Selector Get Graph Data");
    AdminDeviceDao.GetDeviceType(no).then(result => {
        console.log("Device Get : ", result);
        return result;
    }).catch(err => {
        return err;
    });
};

module.exports = {
    GraphSelect,
    GraphSelector
};