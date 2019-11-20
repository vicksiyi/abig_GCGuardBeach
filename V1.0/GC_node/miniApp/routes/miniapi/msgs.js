const express = require('express');
const router = express.Router();
const passport = require('passport');
const Err = require('../../utils/error')
const Msg = require('../../models/Msg');
const MsgUser = require('../../models/MsgUser');

// $routes /mini/msgs/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/msgs/showMsgs
// @desc 查看信息
// @access private
router.get('/showMsgs', passport.authenticate('jwt', { session: false }), (req, res) => {
    Msg.find().then(Msg => {
        if (!Msg) {
            return res.status(404).json('Null');
        }
        res.json(Msg);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/msgs/show
// @desc 模糊搜索
// @access private
router.get('/show', passport.authenticate('jwt', { session: false }), (req, res) => {
    const keyword = new RegExp(req.query.keyword);
    Msg.find({ $or: [{ new_title: keyword }, { msg_address: keyword }, { msg_content: keyword }, { msg_day: keyword }] }).then(Msg => {
        if (!Msg) {
            return res.status(404).json('Null');
        }
        res.json(Msg);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/msgs/showOne/:id
// @desc 获取单个信息
// @access private
router.get('/showOne/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Msg.findOne({ _id: req.params.id }).then(Msg => {
        if (!Msg) {
            return res.status(404).json('Null');
        }
        res.json(Msg);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /mini/msgs/addUser
// @desc 加入志愿者
// @access private
router.post('/addMsgUser', passport.authenticate('jwt', { session: false }), (req, res) => {

    let item = {
        openId: req.user[0].openId,
        msgId: req.body.msgId,
        nickName: req.user[0].nickName,
        avatarUrl: req.user[0].avatarUrl
    }
    Msg.findOne({ _id: item.msgId }).then(msgFind => {
        if (msgFind.msg_status == undefined) {
            MsgUser.findOne({ openId: item.openId, msgId: item.msgId }).then(Msg => {
                if (!Msg) {
                    new MsgUser(item).save().then(() => {
                        res.json({
                            msg: "Success"
                        })
                    }).catch((err) => {
                        Err.ErrorFuc(err, req.originalUrl)
                        res.json(err);
                    })
                } else {
                    res.json({
                        msg: "Existing"
                    })
                }
            }).catch(err => {
                Err.ErrorFuc(err, req.originalUrl)
                res.json(err);
            })
        } else {
            res.json({
                msg: 'End'
            })
        }
    }).catch((err) => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/msgs/showMsgUser/:id
// @desc 获取单个活动已加入人数
// @access private
router.get('/showMsgUser/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    MsgUser.find({ msgId: req.params.id }).then(Msg => {
        res.json({
            user: Msg
        });
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /mini/msgs/userStatus/:id
// @desc 检测是否已经加入
// @access private
router.get('/userStatus/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    MsgUser.findOne({ openId: req.user[0].openId, msgId: req.params.id }).then(Msg => {
        if (!Msg) {
            res.json({
                status: false
            })
        } else {
            res.json({
                status: true
            })
        }
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/msgs/myMsg
// @desc 我加入的活动
// @access private
router.get('/myMsg', passport.authenticate('jwt', { session: false }), (req, res) => {
    MsgUser.find({ openId: req.user[0].openId }).then(MsgTemp => {
        let id = MsgTemp.map(item => {
            return item.msgId
        })
        Msg.find({ _id: { $in: id } }).then((Msg) => {
            res.json(Msg)
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// // $routes /mini/msgs/mySuccessMsg
// // @desc 已完成的活动
// // @access private
// router.get('/mySuccessMsg', passport.authenticate('jwt', { session: false }), (req, res) => {
//     MsgUser.find({ openId: req.user[0].openId }).then(MsgTemp => {
//         let id = MsgTemp.map(item => {
//             return item.msgId
//         })
//         Msg.find({ _id: { $in: id } }).then((Msg) => {
//             res.json(Msg)
//         })
//     }).catch(err => {
//         Err.ErrorFuc(err, req.originalUrl)
//         res.json(err);
//     })
// })

module.exports = router;