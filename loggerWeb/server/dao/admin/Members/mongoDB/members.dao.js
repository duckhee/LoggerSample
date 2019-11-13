const MemberModel = require('../../../../mongoModel/Users/user.mongoDB');

/** Create Member Dao */
const InsertMember = (UserInfo) => {
    console.log('Insert Member Dao');
    MemberModel.save(UserInfo);

};

/** List Member Dao All member */
const ListMember = () => {
    console.log('List Member Dao');

};

/** Paging Member List Dao (Use Member List Page) */
const PagingMember = (PagingInfo) => {
    console.log("List member Paging Dao");
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

/** Member Email Check Dao */
const EmailCheck = (EmailInfo) => {
    console.log("Email Check Member Dao");
    return new Promise((resolve, reject) => {
        MemberModel.count({}, (err, EmailCounts) => {
            if (err) {
                console.log("Email Check Error Code : ", err.code);
                console.log("Email Check Error : ", err);
                return reject(err);
            } else {
                console.log("Email Count ::: ", EmailCounts);
                return resolve(EmailCounts);
            }
        });
    });
};

module.exports = {
    InsertMember,
    ListMember,
    PagingMember,
    SearchMember,
    ModifyMember,
    DeleteMember,
    EmailCheck
};