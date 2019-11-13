const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const getToken = require('../../utils/accessToken');

// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/chats/mode
// @desc 生成小程序码
// @access private
router.get('/mode', passport.authenticate('jwt', { session: false }), (req, res) => {
    (async () => {
        let token = await getToken.access_token()
        // 接口API
        let url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token}`

        request.post({
            url: url,
            form: JSON.stringify({ 'path': req.query.path }),
            responseType: 'arraybuffer',
            header: {
                'content-type': 'application/json;charset=utf-8'
            }
        }, function (err, httpResponse, body) {
            res.json(body)
        })
    })()
})

module.exports = router;