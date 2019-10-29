module.exports = (request, should, app) => {
    describe('GET', () => {
        it('1) Test ', done => {
            request(app)
                .get('')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(' ');
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });
};