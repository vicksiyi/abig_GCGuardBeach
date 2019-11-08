const express = require('express');
const router = express.Router();
const passport = require('passport');
const Err = require('../../utils/error')
const Msg = require('../../models/Msg');

// $routes /api/msgs/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /api/msgs/addMsg
// @desc 发布志愿活动
// @access private
router.post('/addMsg', passport.authenticate('jwt', { session: false }), (req, res) => {
    new Msg({
        msg_title: req.body.title,
        msg_address: req.body.address,
        msg_content: req.body.content,
        msg_image: req.body.image,
        msg_person: req.body.person,
        msg_day: req.body.day,
        msg_latitude: req.body.latitude,
        msg_longitude: req.body.longitude
    }).save().then(Msg => {
        res.json(Msg);
    })
})


// $routes /api/msgs
// @desc 获取所有信息
// @access private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// $routes /api/msgs/:id
// @desc 获取单个信息
// @access private

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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


// $routes /api/msgs/edit
// @desc 编辑信息
// @access private
router.get('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const msgFileds = {};
    if (req.body.title) msgFileds.msg_title = req.body.title;
    if (req.body.address) msgFileds.msg_address = req.body.address;
    if (req.body.content) msgFileds.msg_content = req.body.content;
    if (req.body.image) msgFileds.msg_image = req.body.image;
    if (req.body.person) msgFileds.msg_person = req.body.person;
    if (req.body.day) msgFileds.msg_day = req.body.day;
    if (req.body.latitude) msgFileds.msg_latitude = req.body.latitude;
    if (req.body.longitude) msgFileds.msg_longitude = req.body.longitude;

    console.log(msgFileds)
    Msg.findOneAndUpdate({ _id: req.params.id }, { $set: msgFileds }, { new: true }).then(Msg => {
        res.json({
            msg: Msg
        });
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /api/msgs/delete/:id
// @desc 删除
// @access private
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Msg.findOneAndRemove({ _id: req.params.id }).then(Msg => {
        Msg.save().then(Msg => {
            res.json(Msg);
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /api/msgs/success/:id
// @desc 已完成
// @access private
router.get('/success/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const msgFileds = {};
    msgFileds.msg_status = true
    Msg.findOneAndUpdate({ _id: req.params.id }, { $set: msgFileds }, { new: true }).then(Msg => {
        res.json({
            msg: "Success"
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

module.exports = router;