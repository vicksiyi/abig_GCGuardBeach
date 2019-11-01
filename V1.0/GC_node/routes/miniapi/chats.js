const express = require('express');
const router = express.Router();
const passport = require('passport');
const WebSocketServer = require('websocket').server;
const http = require('http');


let server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
});
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
    
})

module.exports = router;