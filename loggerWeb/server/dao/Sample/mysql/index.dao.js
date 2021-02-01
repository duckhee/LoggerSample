const models = require('../../../DataBase/models/index');
const user = require('../../../DataBase/models/user');

const SampleDao = () => {
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: { id: 1 },
            attributes: ['UserEmail', 'UserName'],
            include: {
                model: models.site,
                attributes: ['name'],
                include: {
                    model: models.plot,
                    attributes: ['PlotName'],
                    include: {
                        model: models.device,
                    }
                }
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};


module.exports = {
    SampleDao
};