const express = require('express');
const router = express.Router();
const passport = require('passport');
const WebSocketServer = require('websocket').server;
const http = require('http');


const originIsAllowed = (origin) => {
    return true;
}

// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/chats/send
// @desc 发消息
// @access private
router.post('/send', passport.authenticate('jwt', { session: false }), (req, res) => {
    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
})

module.exports = router;