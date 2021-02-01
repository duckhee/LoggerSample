var express = require('express');
var router = express.Router();
const request = require('request');
const fs = require('fs');
let HikURL = "http://223.171.44.131:8888/ISAPI/Streaming/channels/1/picture";
let ZoomURL = "http://223.171.44.131:8888/ISAPI/PTZCtrl/channels/1/Continuous";
/* GET home page. */
router.get('/', function(req, res, next) {

    //capture
    request.get(HikURL, { auth: { username: 'admin', password: 'won1228WON' }, encoding: 'binary' }, function(err, response, body) {
        if (err) {
            return res.json(err);
        }

        //fs.writeFileSync('./test.jpeg', body, { encoding: 'binary' });
        res.writeHead(200, { 'Content-Type': 'image/jpg' });
        res.end(body, 'binary');
    });

    /*
    //zoom  10 zoom out 9
    request.put(
            ZoomURL, {
                headers: { 'Content-Type': 'application/xml' },
                body: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<PTZData>" +
                    "<zoom>10</zoom>" +
                    "</PTZData>",
                auth: { username: 'admin', password: 'won1228WON' }
            }, (err, response, body) => {
                if (err) {
                    console.log('error : ', err);
                    return res.json(err);
                }
                console.log('response : ', response);
                return res.json(body);
            });
            */
    /*
    request.get('http://hydro.browse.jp/hydrolift/45-JEJU/45-JEJUdata/g2_10.png', { encoding: 'binary' }, (err, response, body) => {
        fs.writeFileSync('./test.png', body, { encoding: 'binary' });
        res.send(body);
    })
    */
});

module.exports = router;