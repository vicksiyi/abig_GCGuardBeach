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
    let textTemp = `
    <div style="margin: 50px auto;width: 800px;height: 500px;background-color: #ffff;-moz-box-shadow: 2px 2px 3px #dddee1;-webkit-box-shadow: 2px 2px 3px #dddee1;box-shadow: 2px 2px 3px #dddee1;border-radius: 25px;text-align: center;padding-top: 30px;"> <text style="width: 300px;height: 40px;font-size: 26px;color: #495060;">GC海滩卫士</text> <div style="width: 80%;margin: 60px auto;text-align: start;"> <div style="margin-top: 20px;margin-left: 20px;color: #1c2438;font-size: 14px;"> <text style="text-align: left;">HI,GC海滩卫士用户你好:</text> <br> 你正在进行GC海滩卫士的邮箱验证，请输入一下验证码，完成验证操作。 </div> <div style="margin-top: 20px;font-size: 40px;font-weight: bold;color: #2b85e4;text-align: center;">2019</div> <div style="margin-top: 20px;margin-left: 20px;color: #1c2438;font-size: 14px;">如果不是你的邮件请忽略，很抱歉打扰你，请原谅。</div> </div> <div> <hr style="width: 80%;margin: 0 auto;border: 0;height: 1px;background: #333;background-image: linear-gradient(to right, #ccc, #333, #ccc);"> </div> <div style="float: right;margin-top: 30px;margin-right:60px;color: #bbbec4;font-weight: bolder;">GC海滩卫士团队</div> </div>
    `
    let server = email.server.connect(keys.email_server);
    server.send({
        text: '验证',       //邮件内容
        from: '1724264854@qq.com',        //谁发送的
        to: req.body.email,       //发送给谁的
        subject: 'GC海滩卫士',          //邮件主题
        attachment: { data: textTemp, alternative: true }
    }, function (err, message) {
        console.log(err)
        //回调函数
        if (err) {
            res.json(err)
        } else {
            res.json({
                msg: 'Success'
            })
        }
    })
})

module.exports = router;