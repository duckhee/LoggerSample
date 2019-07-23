module.exports = (request, should, app) => {
    describe('GET /admin', () => {
        it("1) /admin testing", done => {
            request(app)
                .get('/admin')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log('admin main page show error code :::: ' + err.code);
                        console.log('admin main page show error :::: ' + err);
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });
}