/** Device Dao */
const Dao = require('../../../dao/admin/Device/index.dao');
const AdminDeviceDao = Dao();

/** Select Last Ten Data */
const ListTenData = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    if (no === "") {
        return res.json(0);
    }
    return res.json(1);
};

/** Select All Data */
const ListAllData = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    if (no === "") {
        return res.json(0);
    }
    return res.json(1);
};

module.exports = {};