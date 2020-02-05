const request = require('request');

/**
 *  Hikvision Control Test
 * 
 * @class CameraControl
 */
class CameraControl {
    constructor(Ip, Id, pass) {
        this.IpAddress = Ip;
        this.UserId = Id;
        this.UserPassword = pass;
    }

    capture() {
        request.get(this.IpAddress + '/ISAPI/Streaming/channels/1/picture', {
            auth: {
                username: this.UserId,
                password: this.UserPassword
            },
            encoding: 'binary'
        }, (error, response, body) => {
            if (error) {
                return error;
            }
            return body;
        });
    }
    zoomIn() {
        request.put(this.IpAddress + "ISAPI/PTZCtrl/channels/1/Continuous", {
            headers: { 'Content-Type': 'application/xml' },
            body: "<?xml version='1.0' encoding='UTF-8'?>" +
                "<PTZData>" +
                "<zoom>10</zoom>" +
                "</PTZData>",
            auth: {
                username: this.UserId,
                password: this.UserPassword
            },
            encoding: 'binary'
        }, (error, response, body) => {
            if (error) {
                return error;
            }
            return body;
        });
    }
    zoomOut() {
        request.put(this.IpAddress + "ISAPI/PTZCtrl/channels/1/Continuous", {
            headers: { 'Content-Type': 'application/xml' },
            body: "<?xml version='1.0' encoding='UTF-8'?>" +
                "<PTZData>" +
                "<zoom>9</zoom>" +
                "</PTZData>",
            auth: {
                username: this.UserId,
                password: this.UserPassword
            },
            encoding: 'binary'
        }, (error, response, body) => {
            if (error) {
                return error;
            }
            return body;
        });
    }
}