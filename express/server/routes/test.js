const express = require('express');
const router = express.Router();
var ftpClient = require('basic-ftp');
var request = require('request'),
    //rp = require('request-promise'),
    username = "admin",
    password = "won1228WON",
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
var fs = require('fs');

router.get("/camera", (req, res, next) => {
    url = "http://223.171.44.131:8888/ISAPI/Streaming/channels/1/picture";
    request({
            url: url,
            headers: {
                "Authorization": auth
            }
        })
        .on('response', function(response) {
            console.log('response status : ', response.statusCode);
            if (response.statusCode == 401) {
                console.log('wrong auth');
                res.statusCode = 401;
                res.write("wrong");
                return res.end();
            }
            if (response.statusCode == 403) {
                console.log('null');
                res.statusCode = 403;
                return res.json(403);
                res.write("wrong");
                return res.end();
            }
        })
        .pipe(res);
});

router.get('/test', (req, res, next) => {
    url = "http://223.171.44.131:8888/ISAPI/Streaming/channels/2/picture";
    request({
            url: url,
            headers: {
                "Authorization": auth
            }
        }).on('response', (response) => {
            console.log('response status : ', response.statusCode);
            if (response.statusCode == 403) {
                res.status(403);



                return res.json("Invalid Operation");


            }
        })
        .pipe(res);
});

router.get('/ftptest', (req, res, next) => {

});

module.exports = router;