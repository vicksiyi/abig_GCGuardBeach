const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const getToken = require('../../utils/accessToken');
const Life = require('../../models/Life');
const LifeType = require('../../models/LifeType');
const Err = require('../../utils/error');
const LifeFocus = require('../../models/LifeFocus');
const LifeGood = require('../../models/LifeGood');
const LifeMsg = require('../../models/LifeMsg');
// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    new LifeType({
        oneType: req.query.oneType,
        twoType: req.query.twoType
    }).save().then(msg => {
        res.json(msg)
    })
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

// $routes /mini/chats/send
// @desc 发送生活圈
// @access private
router.post('/send', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.picture != '' || req.body.content != '') {
        LifeType.findOne({ twoType: req.body.type }).then(lifetype => {
            if (lifetype) {
                new Life({
                    nickName: req.user[0].nickName,
                    avatarUrl: req.user[0].avatarUrl,
                    picture: JSON.parse(req.body.picture),
                    content: req.body.content,
                    openId: req.user[0].openId,
                    type: req.body.type //需检查
                }).save().then(life => {
                    res.json({
                        msg: "Success"
                    })
                }).catch(err => {
                    Err.ErrorFuc(err, req.originalUrl)
                    res.json({
                        msg: 'Error'
                    })
                })
                return
            }
            res.json({
                msg: '字段错误!'
            })
        })
    } else {
        res.json({
            msg: '字段错误!'
        })
    }
})

// $routes /mini/chats/show
// @desc 查看生活圈
// @access private
router.get('/show', passport.authenticate('jwt', { session: false }), (req, res) => {
    Life.find().sort({ time: -1 }).skip(req.query.page * 10).limit(10).then(New => {
        res.json(New)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: "Error"
        });
    })
})

// $routes /mini/chats/showType
// @desc 查看类型
// @access public
router.get('/showType', (req, res) => {
    LifeType.find().then(type => {
        res.json(type)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/chats/showGood
// @desc 点赞人
// @access private
router.get('/showGood/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeGood.find({ lifeId: res.params.id }).then(life => {
        res.json(life)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/chats/showMsgNum
// @desc 评论数获取
// @access private
router.get('/showMsgNum/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeMsg.find({ lifeId: res.params.id }).then(life => {
        res.json({
            msg: life.length
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})


// $routes /mini/chats/showMsg
// @desc 评论获取
// @access private
router.get('/showMsg/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeMsg.find({ lifeId: res.params.id }).then(life => {
        res.json(life)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/chats/addGood
// @desc 点赞
// @access private
router.get('/addGood/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    new LifeGood({
        openId: req.user[0].openId,
        nickName: req.user[0].nickName,
        avatarUrl: req.user[0].avatarUrl,
        lifeId: req.params.id
    }).save().then(life => {
        res.json({
            msg: 'Success'
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/chats/addMsg
// @desc 评论
// @access private
router.get('/addMsg/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    new LifeMsg({
        openId: req.user[0].openId,
        nickName: req.user[0].nickName,
        avatarUrl: req.user[0].avatarUrl,
        lifeId: req.params.id,
        msg: req.body.msg
    }).save().then(life => {
        res.json({
            msg: 'Success'
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/chats/focus
// @desc 关注
// @access private
router.get('/focus/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    new LifeFocus({
        openId: req.user[0].openId,
        focusId: req.params.id
    }).save().then(life => {
        res.json({
            msg: 'Success'
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

module.exports = router;