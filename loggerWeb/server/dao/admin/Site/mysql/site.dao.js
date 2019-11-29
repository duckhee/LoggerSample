const models = require('../../../../DataBase/models/index');
const site = require('../../../../DataBase/models/site');


/** Create Site */
const CreateSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {
        models.site.create({
            name: SiteInfo.name,
            Owner: SiteInfo.owner
        }).then(result => {
            console.log('create site return value : ', result);
            return resolve(result);
        }).catch(err => {
            console.log("Dao Create Site Error code ::: ", err.code);
            console.log("Dao Create Site Error ::: ", err);
            return reject(err);
        });
    });
};

/** List Site */
const ListSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {
        models.site.findAll().then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Count Site */
const CountSite = () => {
    return new Promise((resolve, reject) => {
        models.site.count().then(result => {
            console.log('site Counter : ', result);
            return resolve(result);
        }).catch(err => {
            console.log('Dao Counter Site Error code ::: ', err.code);
            console.log('Dao Counter Site Error ::: ', err);
            return reject(err);
        });
    });
};

/** Paging Site */
const PagingSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {
        CountSite().then(result => {
            let AllSiteNumber = result;
            let PagingNum = SiteInfo.pages;
            let offsetting = 0;
            let MaxPages;
            if (parseInt(AllSiteNumber % 10) !== 0) {
                MaxPages = parseInt(AllSiteNumber / 10 + 1);
            } else {
                MaxPages = parseInt(AllSiteNumber / 10);
            }
            console.log('site count ::: ', AllSiteNumber);
            console.log('max Pages : ', MaxPages);
            console.log('site page info : ', SiteInfo);
            if (PagingNum > 1) {
                offsetting = 10 * (PagingNum - 1);
            }
            console.log('offsetting : ', offsetting);
            let SearchOptions = {};
            if ((SiteInfo.SearchByName !== "") && (SiteInfo.SearchByName !== undefined)) {
                SearchOptions.name = SiteInfo.SearchByName;
            }
            if ((SiteInfo.SearchByOwner !== "") && (SiteInfo.SearchByOwner !== undefined)) {
                SearchOptions.Owner = SiteInfo.SearchByOwner;
            }
            models.site.findAll({
                where: SearchOptions,
                limit: 10,
                offset: offsetting,
                order: [
                    ['createdAt', 'DESC']
                ],

                include: {
                    model: models.plot,
                    group: 'SiteIdx',
                    /*
                    attributes: [
                        [models.sequelize.fn('count', '*'), 'count']
                    ],
                    */
                }
            }).then(Sites => {
                /** Return Value */
                let returnValue = {
                    offset: offsetting,
                    value: Sites,
                    pageNumber: MaxPages
                };
                return resolve(returnValue);
            }).catch(err => {
                console.log('Dao Paging Site Error code ::: ', err.code);
                console.log('Dao Paging Site Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log('Dao Paging Count Site Error code ::: ', err.code);
            console.log('Dao Paging Count Site Error ::: ', err);
            return reject(err);
        });
    });
};

/** Delete Site */
const DeleteSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {
        if (SiteInfo.id === "") {
            return reject(false);
        }
        models.site.destroy({
            where: {
                id: SiteInfo.id
            }
        }).then(result => {
            console.log('delete site success result : ', result);
            PagingSite(SiteInfo).then(result => {
                console.log('site delete done and show paging : ', result);
                return resolve(result);
            }).catch(err => {
                console.log('Dao Delete Paging Site Error code ::: ', err.code);
                console.log('Dao Delete Paging Site Error ::: ', err);
                return reject(err);
            })
        }).catch(err => {
            console.log('Dao Delete Site Error code ::: ', err.code);
            console.log('Dao Delete Site Error ::: ', err);
            return reject(err);
        });
    });
};

/** Detail Site */
const DetailSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {
        if (SiteInfo.id === "") {
            return reject(false);
        }
        models.site.findOne({
            where: {
                id: SiteInfo.id
            },
            include: [{
                model: models.plot,
                order: [
                    [
                        'createdAt', 'DESC'
                    ]
                ],
                include: {
                    model: models.device,

                }
            }]
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Dao Detail Site Error code ::: ', err.code);
            console.log('Dao Detail Site Error ::: ', err);
            return reject(err);
        });
    });
};

/** Modify Site */
const ModifySite = (SiteInfo) => {
    return new Promise((resolve, reject) => {

    });
};


/** Search Site  */
const SearchSite = (SiteInfo) => {
    return new Promise((resolve, reject) => {

    });
};


/** Site Name Check */
const SiteNameCheck = (SiteName) => {
    return new Promise((resolve, reject) => {
        models.site.findAll({
            where: {
                name: SiteName,
            },
            attributes: ['id', 'name', 'createdAt'],
            include: [{
                model: models.user,
                attributes: [
                    'UserEmail'
                ]
            }, {
                model: models.plot,
                attributes: ['id', 'PlotName', 'createdAt']
            }]
        }).then(result => {
            console.log('result : ', result)
            return resolve(result);
        }).catch(err => {
            console.log('Dao Checking Site Name Error code ::: ', err.code);
            console.log('Dao Checking Site Name Error ::: ', err);
            return reject(err);
        });
    });
};

module.exports = {
    CreateSite,
    ListSite,
    PagingSite,
    DetailSite,
    ModifySite,
    DeleteSite,
    SearchSite,
    SiteNameCheck
};