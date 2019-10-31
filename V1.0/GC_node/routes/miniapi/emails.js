const express = require('express');
const router = express.Router();
const passport = require('passport');
const email = require('emailjs/email');
const keys = require('../../config/keys')


// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/emails/send
// @desc 发送邮箱
// @access private
router.post('/send', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body)
    let server = email.server.connect(keys.email_server);
    server.send({
        text: `验证码:${req.body.num}`,       //邮件内容
        from: '1724264854@qq.com',        //谁发送的
        to: req.body.email,       //发送给谁的
        subject: 'GC海滩卫士~验证邮箱'          //邮件主题
    }, function (err, message) {
        console.log(err)
        //回调函数
        if (err) {
            res.json(err)
        } else {
            res.json({
                msg: 'Success',
                num: message.text.split(":")[1]
            })
        }
    })
})

module.exports = router;