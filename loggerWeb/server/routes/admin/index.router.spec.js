/** Admin User Test Router */
const AdminUsersTest = require('./Users/users.router.spec');
/** Admin Member Test Router */
const AdminMembersTest = require('./Member/member.router.spec');

module.exports = (request, should, app) => {
    describe('GET Admin Main', () => {
        /** Main Get Test */
        it("1) Admin Main Page test", done => {
            request(app)
                .get('/admin')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(" Admin Main Test Error Code : ", err.code);
                        console.log(" Admin Main Test Error : ", err);
                    } else {
                        done();
                    }
                });
        });
    });
    /** Admin Users Test */
    AdminUsersTest(request, should, app);
    /** Admin Member Test */
    AdminMembersTest(request, should, app);

};