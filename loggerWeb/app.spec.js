const mocha = require('mocha');
const should = require('should');
const request = require('supertest');

let app = require('./app');
/** 
 * testing module add 
 */
const IndexTest = require('./server/routes/customer/index.spec');

/**
 * all testing Start function
 */
const TestingStart = () => {
    /** Index Testing */
    IndexTest(request, should, app);
};


TestingStart();