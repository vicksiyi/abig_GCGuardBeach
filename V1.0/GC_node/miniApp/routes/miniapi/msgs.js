const express = require('express');
const router = express.Router();
const passport = require('passport');
const Err = require('../../utils/error')
const Msg = require('../../models/Msg');

// $routes /api/find/ceshi
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

module.exports = router;