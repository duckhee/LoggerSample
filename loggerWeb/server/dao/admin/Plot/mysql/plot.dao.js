const models = require('../../../../DataBase/models/index');
const plot = require('../../../../DataBase/models/plot');

/** Plot Create */
const CreatePlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {
        models.plot.create({
            PlotName: PlotInfo.name,
            Owner: PlotInfo.owner,
            SiteIdx: PlotInfo.siteIdx
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Dao Plot Create Error code ::: ', err.code);
            console.log('Dao Plot Create Error ::: ', err);
            return reject(err);
        });
    });
};

/** Count Plot */
const CountPlot = () => {
    return new Promise((resolve, reject) => {
        models.plot.count().then(result => {
            console.log('Plot Counter : ', result);
            return resolve(result);
        }).catch(err => {
            console.log('Dao Counter Plot Error code ::: ', err.code);
            console.log('Dao Counter Plot Error ::: ', err);
            return reject(err);
        });
    });
};

/** Plot List */
const ListPlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {

        models.plot.findAll({

        }).then(result => {

        }).catch(err => {

        });
    });
};

/** Plot Paging */
const PagingPlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {
        /** Count All Plot first */
        CountPlot().then(result => {
            let AllPlotNumber = result;
            let PagingNum = PlotInfo.pages;
            let offsetting = 0;
            let MaxPages = parseInt(AllPlotNumber / 10 + 1);
            if (parseInt(AllPlotNumber % 10) !== 0) {
                MaxPages = parseInt(AllPlotNumber / 10 + 1);
            } else {
                MaxPages = parseInt(AllPlotNumber / 10);
            }
            console.log('plot count ::: ', AllPlotNumber);
            console.log('Page Info : ', PlotInfo);
            if (PagingNum > 1) {
                offsetting = 10 * (PagingNum - 1);
            }
            console.log('offset : ', offsetting);
            let SearchOptions = {};
            if ((PlotInfo))
            /** Paging Logic */
                models.plot.findAll({
                where: SearchOptions,
                limit: 10,
                offset: offsetting,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                    model: models.site,

                }, { model: models.device, group: 'PlotIdx' }]
            }).then(Plots => {
                console.log('Plot Info :: ', Plots);
                //console.log('Plot Info :: ', Plots[0].dataValues.site.dataValues);
                /** return value */
                let returnValue = {
                    offset: offsetting,
                    value: Plots,
                    pageNumber: MaxPages
                };
                return resolve(returnValue);
            }).catch(err => {
                console.log('Dao Paging Plot Error code ::: ', err.code);
                console.log('Dao Paging Plot Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log('Dao Paging Count Plot Error code ::: ', err.code);
            console.log('Dao Paging Count Plot Error ::: ', err);
            return reject(err);
        });
    });
};

/** Plot Detail */
const DetailPlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {
        if (PlotInfo.id === "") {
            return reject(false);
        }
        models.plot.findOne({
            where: {
                id: PlotInfo.id
            },
            include: [{
                model: models.device,
                order: [
                    ['createdAt', 'DESC']
                ],
            }]
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Dao Detail Plot Error code ::: ', err.code);
            console.log('Dao Detail Plot Error ::: ', err);
            return reject(err);
        });
    });
};

/** Plot Modify */
const ModifyPlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {
        models.plot.update({

        }, {
            where: {

            }
        }).then(result => {

        }).catch(err => {

        });
    });
};

/** Plot Search */
const SearchPlot = (PlotInfo) => {

};

/** Plot Delete */
const DeletePlot = (PlotInfo) => {
    return new Promise((resolve, reject) => {
        if (PlotInfo.id === "") {
            return reject(false);
        }
        models.plot.destroy({
            where: {
                id: PlotInfo.id
            }
        }).then(result => {
            console.log('delete plot success result : ', result);
            PagingPlot(PlotInfo).then(result => {
                console.log('site delete done and show paging : ', result);
                return resolve(result);
            }).catch(err => {
                console.log('Dao Delete Paging Plot Error code ::: ', err.code);
                console.log('Dao Delete Paging Plot Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log('Dao Delete Plot Error code ::: ', err.code);
            console.log('Dao Delete Plot Error code ::: ', err);
            return reject(err);
        });
    });
};

/** Plot Name Check */
const PlotNameCheck = (PlotName) => {
    return new Promise((resolve, reject) => {
        models.plot.findAll({
            where: {
                PlotName: PlotName
            },
            attributes: ['id', 'PlotName', 'createdAt'],
            include: {
                model: models.site,
                attributes: ['name', 'id'],
                include: {
                    model: models.user,
                    attributes: ['UserEmail']
                }
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Dao Checking Plot Name Error code ::: ', err.code);
            console.log('Dao Checking Plot Name Error ::: ', err);
            return reject(err);
        });
    });
};


module.exports = {
    CreatePlot,
    ListPlot,
    PagingPlot,
    DetailPlot,
    ModifyPlot,
    SearchPlot,
    DeletePlot,
    PlotNameCheck
};