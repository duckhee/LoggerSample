const MemberModel = require('../../../../DataBase/mongoModel/Users/user.mongoDB');

class UserDao {


    /** Create Member Dao */
    InsertMember(UserInfo) {
        console.log('Insert Member Dao');
        MemberModel.save(UserInfo).then(result => {

        }).catch(err => {

        });

    }

    /** List Member Dao All member */
    ListMember() {
        console.log('List Member Dao');

    };

    /** Paging Member List Dao (Use Member List Page) */
    PagingMember(PagingInfo) {
        console.log("List member Paging Dao");
    }

    /** SearchMember Dao */
    SearchMember(SearchInfo) {
        console.log('Search Member Dao');
    }

    /** Modify Member Dao */
    ModifyMember(ModifyInfo) {
        console.log('Modify Member Dao');
    }

    /** Delete Member Dao */
    DeleteMember(DeleteInfo) {
        console.log('Delete Member Dao');
    }

    /** Member Email Check Dao */
    EmailCheck(EmailInfo) {
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
    }

}
module.exports = UserDao;