const mocha = require('mocha');
const should = require('should');
const request = require('supertest');

let app = require('./app');

/**
 * testing Admin module add
 */
const AdminTest = require('./server/routes/admin/index.router.spec');

/** 
 * testing Customer module add
 */
const CustomerTest = require('./server/routes/customer/index.router.spec');

/**
 * all testing Start function
 */
const TestingStart = () => {
    /** Admin Testing */
    AdminTest(request, should, app);
    /** Customer Testing */
    CustomerTest(request, should, app);
};


TestingStart();