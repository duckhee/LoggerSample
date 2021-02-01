module.exports = (request, should, app) => {
    /** Get Method Test Describe */
    describe("GET Admin Member Test", () => {
        /** Admin Member Main Page */
        it("1) Admin Member Main Page Test (Redirect Member List)", done => {
            request(app)
                .get('/admin/Members')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin Member Main Page Redirect Error code ::: ", err.code);
                        console.log("Admin Member Main Page Redirect Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Member List Page */
        it("2) Admin Member List Page Test", done => {
            request(app)
                .get('/admin/Members/list')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin Member List Page Error code ::: ", err.code);
                        console.log("Admin Member List Page Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Member Create Page */
        it("3) Admin Member Create Page Test", done => {
            request(app)
                .get('/admin/Members/registe')
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Member Registe Page Error code ::: ', err.code);
                        console.log('Admin Member Registe Page Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Member Modify Page */
        it("4) Admin Member Modify Page Test", done => {
            request(app)
                .get('/admin/Members/modify')
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Member Modify Page Error code ::: ', err.code);
                        console.log('Admin Member Modify Page Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Member Profile Page */
        it("5) Admin Member Profile Page Test", done => {
            request(app)
                .get('/admin/Members/profile')
                .end((err, res) => {
                    if (err) {
                        console.log("Admin Member Profile Error code ::: ", err.code);
                        console.log("Admin Member Profile Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });
    /** Post Method Test Describe */
    describe("POST Admin Member Test", done => {
        it("1) Create Member Do Test", done => {
            request(app)
                .post('/admin/Members/create')
                .send({

                })
                .end((err, res) => {
                    if (err) {
                        console.log("POST Admin Member Create Error code ::: ", err.code);
                        console.log("POST Admin Member Create Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });
};