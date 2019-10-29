//login & register
const express = require('express');
const router = express.Router();
const request = require('request');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const userDecrypt = require('../../utils/userDecrypt')
const User = require('../../models/User');
const Err = require('../..//utils/error')
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt')

// $routes /api/users/register
// @desc 返回请求的json数据
// @access public
router.post('/register', (req, res) => {
    console.log("暂无")
})

// $routes /api/users/login
// @desc 获取&更新数据库
// @access public
router.get('/login', (req, res) => {

    let JSCODE = req.query.code;

    request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${keys.APPID}&secret=${keys.SECRET}&js_code=${JSCODE}&grant_type=authorization_code`, function (error, response, body) {
        // 格式化JSON
        let data = JSON.parse(body)
        // 响应
        if (data.openid) {
            let Item = {}
            if (req.query.iv && req.query.encryptedData) {
                let pc = new WXBizDataCrypt(keys.APPID, data.session_key)

                let dataTemp = pc.decryptData(req.query.encryptedData, req.query.iv)

                Item.nickName = dataTemp.nickName;
                Item.avatarUrl = dataTemp.avatarUrl;
            }
            Item.openId = data.openid

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
    });
})

module.exports = router;