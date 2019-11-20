const models = require('../../../../DataBase/models/index');
const site = require('../../../../DataBase/models/site');

/** Create Site */
const CreateSite = (SiteInfo) => {
    models.site.create({}).then((result) => {

    }).catch((err) => {

    });

};

/** List Site */
const ListSite = (SiteInfo) => {

};

/** Paging Site */
const PagingSite = (SiteInfo) => {

};

/** Detail Site */
const DetailSite = (SiteInfo) => {

};

/** Modify Site */
const ModifySite = (SiteInfo) => {

};

/** Delete Site */
const DeleteSite = (SiteInfo) => {

};

/** Search Site  */
const SearchSite = (SiteInfo) => {

};

module.exports = {
    CreateSite,
    ListSite,
    PagingSite,
    DetailSite,
    ModifySite,
    DeleteSite,
    SearchSite
};