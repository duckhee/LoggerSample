const mocha = require('mocha');
const should = require('should');
const request = require('supertest');

let app = require('./app');


/** 
 * testing module add 
 */
const AdminMainTest = require('./server/routes/admin/index.router.spec');
const AdminUserTest = require('./server/routes/admin/user/admin.user.router.spec');
const AdminLoggerTest = require('./server/routes/admin/logger/admin.logger.router.spec');

AdminMainTest(request, should, app);
AdminUserTest(request, should, app);
AdminLoggerTest(request, should, app);