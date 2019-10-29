const MemberModel = require('../../../../mongoModel/Users/user.mongoDB');

/** Create Member Dao */
const InsertMember = (UserInfo) => {
    console.log('Insert Member Dao');

};

/** List Member Dao */
const ListMember = () => {
    console.log('List Member Dao');

};

/** Paging Member List Dao */
const PagingMember = (PagingInfo) => {

};

/** SearchMember Dao */
const SearchMember = (SearchInfo) => {
    console.log('Search Member Dao');
};

/** Modify Member Dao */
const ModifyMember = (ModifyInfo) => {
    console.log('Modify Member Dao');
};

/** Delete Member Dao */
const DeleteMember = (DeleteInfo) => {
    console.log('Delete Member Dao');
};


module.exports = {
    InsertMember,
    ListMember,
    PagingMember,
    SearchMember,
    ModifyMember,
    DeleteMember
};