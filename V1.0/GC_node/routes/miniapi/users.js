//login & register
const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const User = require('../../models/User');
const Err = require('../../utils/error')
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt')


// 返回body
const oauthFunc = (code) => {
    let JSCODE = code
    let data = {}
    request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${keys.APPID}&secret=${keys.SECRET}&js_code=${JSCODE}&grant_type=authorization_code`, function (error, response, body) {
        data = JSON.parse(body)
    });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 1000);
    })
}
// $routes /api/users/register
// @desc 返回请求的json数据
// @access public
router.post('/register', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("暂无")
})

// $routes /api/users/login
// @desc 获取&更新数据库
// @access public
router.get('/login', (req, res) => {
    (async () => {
        let data = await oauthFunc(req.query.code)
        let iv = req.query.iv
        let encryptedData = req.query.encryptedData

        // 响应
        if (data.openid) {
            let Item = {}
            if (iv && encryptedData) {
                let pc = new WXBizDataCrypt(keys.APPID, data.session_key)

                let dataTemp = pc.decryptData(encryptedData, iv)

                Item.nickName = dataTemp.nickName;
                Item.avatarUrl = dataTemp.avatarUrl;
            }
            Item.openId = data.openid

            // 更新用户信息
            User.findOneAndUpdate({ openId: data.openid }, { $set: Item }, { new: true }).then(user => {
                if (!user) {
                    new User(Item).save().then(user => {
                        res.json(user)
                    }).catch(err => {
                        Err.ErrorFuc(err, req.originalUrl)
                        res.json(err);
                    })
                } else {
                    res.json(user)
                }
            }).catch(err => {
                Err.ErrorFuc(err, req.originalUrl)
                res.json(err);
            })

        } else {
            res.json(data)
        }
    })()
})

// $routes /api/users/oauth
// @desc 放回验证接口登录密钥
// @access public
router.post('/oauth', (req, res) => {
    (async () => {
        // 格式化JSON
        let data = await oauthFunc(req.body['code'])
        let iv = req.body['iv']
        let encryptedData = req.body['encryptedData']
        // 响应
        if (data.openid) {
            if (iv && encryptedData) {
                const rule = { openId: data.openid }
                jwt.sign(rule, keys.secretUser, { expiresIn: 3600 }, (err, token) => {
                    if (err) {
                        throw err;
                    } else {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    }
                })
            } else {
                res.json({
                    msg: "用户未授权"
                })
            }
        } else {
            res.json(data)
        }
    })()
})


module.exports = router;