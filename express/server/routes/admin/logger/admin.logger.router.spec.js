module.exports = (request, should, app) => {
    describe('/admin/logger', () => {

        /**
         * admin/logger redirect testing expect 302
         */
        it('1) GET /admin/logger Test expect 302', (done) => {
            request(app)
                .get('/admin/logger')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        console.log('admin logger page error code :::: ' + err.code);
                        console.log('admin logger page error :::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * admin/logger/list testing expect 200
         */
        it('2) /admin/logger/list Test expect 200', done => {
            request(app)
                .get('/admin/logger/list')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('admin logger list page error code ::: ' + err.code);
                        console.log('admin logger list page error ::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * admin/logger/insert testing expect 200
         */
        it('3) admin/logger/insert Test expect 200', done => {
            request(app)
                .get('/admin/logger/insert')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('admin logger insert page error code ::: ' + err.code);
                        console.log('admin logger insert page error :::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * admin/logger/detail testing expect 200 param testing 0
         */
        it('4) admin/logger/detail Test expect 200', done => {
            request(app)
                .get('/admin/logger/detail?no=0')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('admin logger detail page error code :::: ', err.code);
                        console.log('admin logger detail page error :::: ', err);
                        throw err;
                    }
                    done();
                });
        });

        /**
         * 
         */

    });
};