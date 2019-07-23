module.exports = (request, should, app) => {
    describe('/admin/member ', () => {

        /**
         * /admin/member redirect testing expect 302 
         */
        it('1) GET /admin/member Test expect 302', (done) => {
            request(app)
                .get('/admin/member')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        console.log('admin member main page error code :::: ' + err.code);
                        console.log('admin member main page error :::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * /admin/member/list testing expect 200
         */
        it('2) GET /admin/member/list Test expect 200', done => {
            request(app)
                .get('/admin/member/list')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("admin member list page error code :::: " + err.code);
                        console.log("admin member list page error :::: " + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * /admin/member/create testing expect 200
         */
        it('3) GET /admin/member/create Test expect 200', done => {
            request(app)
                .get('/admin/member/create')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('admin member create page error code :::: ' + err.code);
                        console.log('admin member create page error :::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        /**
         * /admin/member/update testing expect 200
         */
        it('4) GET /admin/member/update?no=1', done=>{
            request(app)
                .get('/admin/member/update?no=1')
                .expect(200)
                .end((err, res)=>{
                    if(err){
                        console.log('admin member update page error code ::: ', err.code);
                        console.log('admin member update page error ::: ', err);
                        throw err;
                    }else{
                        done();
                    }
                });
        });


    });
};