module.exports = (request, should, app) => {
    /** GET Method Test */
    describe('GET Admin Plot Test', () => {
        /** Admin Plot Main Page */
        it('1) Admin Plot Main Page Test (Redirect Plot List Page)', done => {
            request(app)
                .get('/admin/Plot')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Plot Main Page Redirect Error code ::: ', err.code);
                        console.log('Admin Plot Main Page Redirect Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Plot List Page */
        it('2) Admin Plot List Page', done => {
            request(app)
                .get('/admin/Plot/list')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("Admin Plot List Page Error code ::: ", err.code);
                        console.log("Admin Plot List Page Error ::: ", err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        /** Admin Plot Detail Page */
        it('3) Admin Plot Detail Page', done => {
            request(app)
                .get('/admin/Plot/Detail?no=1')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Plot Detail Page Error code ::: ', err.code);
                        console.log('Admin Plot Detail Page Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });
    /** POST Method Test */
    describe('POST Admin Plot Test', () => {
        /** Admin Plot Create Do */
        it('1) Admin Plot Create Do', done => {
            request(app)
                .post('/admin/Plot/create')
                .send({})
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Plot Create Do Error code ::: ', err.code);
                        console.log('Admin Plot Create Do Error ::: ', err);
                    } else {
                        done();
                    }
                });
        });
        /** Admin Plot Detail Do */
        it('2) Admin plot Detail Do', done => {
            request(app)
                .post('/')
                .send({})
                .end((err, res) => {
                    if (err) {
                        console.log('Admin Plot Detail Do Error code ::: ', err.code);
                        console.log('Admin Plot Detail Do Error ::: ', err);
                        throw err;
                    } else {
                        done();
                    }
                });
        })

    });
};