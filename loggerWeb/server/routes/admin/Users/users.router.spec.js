module.exports = (request, should, app) => {
    /** GET Method Test */
    describe('GET Admin User Test', () => {
        /** Admin User Main Page */
        it("1) Admin User Main Page Test (Redirect User Profile Page)", done => {
            request(app)
                .get('/admin/User')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin User Main Page Redirect Error code ::: ", err.code);
                        console.log("Admin User Main Page Redirect Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin User Profile Page */
        it("2) Admin User Profile Page", done => {
            request(app)
                .get('/admin/User')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin User Profile Page Error code ::: ", err.code);
                        console.log("Admin User Profile Page Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin User Login Page */
        it("3) Admin User Login Page", done => {
            request(app)
                .get('/admin/User/login')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin User Login Page Error code ::: ", err.code);
                        console.log("Admin User Login Page Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin User modify Page */
        it("4) Admin User Modify Page", done => {
            request(app)
                .get('/admin/User/modify')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('Admin User Modify Page Error code ::: ', err.code);
                        console.log('Admin User Modify Page Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });

    /** POST Method Test */
    describe("POST Admin User Test", () => {

    });
};