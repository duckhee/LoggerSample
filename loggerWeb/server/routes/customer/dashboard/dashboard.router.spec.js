module.exports = (request, should, app) => {
    /** Get Test */
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
    /** Post Test */
    describe('POST', () => {
        it('1) Test', done => {
            request(app)
                .post('')
                .send({})
                .expect(200)
                .end((err, res) => {

                });
        });
    });
};