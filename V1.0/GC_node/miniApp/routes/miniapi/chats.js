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
    Life.find().sort({ time: -1 }).limit(10).then(New => {
        res.json(New)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: "Error"
        });
    })
})

// $routes /mini/chats/show
// @desc 分页查看生活圈(加标签->防止脏读)
// @access private
router.get('/showPage', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.query)
    Life.find({ time: { "$lt": req.query.time } }).sort({ time: -1 }).limit(10).then(New => {
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

// $routes /mini/chats/showTypeOne
// @desc 查看单一类型
// @access public
router.get('/showTypeOne', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeType.findOne({ twoType: req.query.type }).then(type => {
        let image = type.image
        // 获取关注数
        LifeFocus.find({ focusId: req.query.type }).then(typeLen => {
            let num = typeLen.length
            status = false
            typeLen.map(value => {
                if (value.openId == req.user[0].openId) {
                    status = true
                    return
                }
            })
            res.json({
                image: image,
                num: num,
                status: status
            })
        }).catch(err => {
            Err.ErrorFuc(err, req.originalUrl)
            res.json({
                msg: 'Error'
            })
        })
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
// @desc 关注/取消
// @access private
router.get('/focus', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeType.findOne({ twoType: req.query.type }).then(lifetype => {
        if (lifetype) {
            LifeFocus.findOne({ openId: req.user[0].openId, focusId: lifetype.twoType }).then(data => {
                if (!data) {
                    new LifeFocus({
                        openId: req.user[0].openId,
                        focusId: lifetype.twoType
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
                } else {
                    LifeFocus.findOneAndRemove({ openId: req.user[0].openId, focusId: lifetype.twoType }).then(lifefocus => {
                        lifefocus.save().then(close => {
                            res.json({
                                msg: 'Close'
                            });
                        })
                    }).catch(err => {
                        res.json(err);
                    })
                }
            })
        } else {
            res.json({
                msg: 'Null'
            })
        }
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})


// $routes /mini/chats/focusFirst
// @desc 首次获取信息
// @access private
router.get('/focusFirst', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeFocus.find({ openId: req.user[0].openId }).then(lifefocus => {
        let result = lifefocus.map(value => {
            return value.focusId
        })
        Life.find({ type: { "$in": result } }).sort({ time: -1 }).limit(10).then(data => {
            res.json(data)
        })
    })
})


// $routes /mini/chats/focusMsg
// @desc 分页查看关注生活圈(加标签->防止脏读)
// @access private
router.get('/focusMsg', passport.authenticate('jwt', { session: false }), (req, res) => {
    LifeFocus.find({ openId: req.user[0].openId }).then(lifefocus => {
        let result = lifefocus.map(value => {
            return value.focusId
        })
        Life.find({ type: { "$in": result }, time: { "$lt": req.query.time } }).sort({ time: -1 }).limit(10).then(data => {
            res.json(data)
        })
    })
})


// $routes /mini/chats/focus
// @desc 获取精选的信息
// @access private
router.get('/good', passport.authenticate('jwt', { session: false }), (req, res) => {
    Life.find({ openId: 'otdIv5RxNOOGGRn0ebk2xakTeahg' }).sort({ time: -1 }).limit(10).then(lifefocus => {
        res.json(lifefocus)
    })
})

// $routes /mini/chats/goodPage
// @desc 分页查看精选圈(加标签->防止脏读)
// @access private
router.get('/goodPage', passport.authenticate('jwt', { session: false }), (req, res) => {
    Life.find({ openId: 'otdIv5RxNOOGGRn0ebk2xakTeahg', time: { "$lt": req.query.time } }).sort({ time: -1 }).limit(10).then(lifefocus => {
        res.json(lifefocus)
    })
})

// $routes /mini/chats/showFocus
// @desc 查看关注的内容
// @access private
router.get('/showFocus', passport.authenticate('jwt', { session: false }), (req, res) => {
    Life.find({ type: req.query.type }).sort({ time: -1 }).limit(10).then(lifefocus => {
        res.json(lifefocus)
    })
})


// $routes /mini/chats/showPageFocus
// @desc 分页查看关注的内容(加标签->避免脏读)
// @access private
router.get('/showPageFocus', passport.authenticate('jwt', { session: false }), (req, res) => {
    Life.find({ type: req.body.type, time: { "$lt": req.query.time } }).sort({ time: -1 }).limit(10).then(lifefocus => {
        res.json(lifefocus)
    })
})


module.exports = router;