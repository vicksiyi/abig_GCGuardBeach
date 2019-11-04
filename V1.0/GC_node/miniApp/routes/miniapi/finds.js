const express = require('express');
const router = express.Router();
const passport = require('passport');
const Find = require('../../models/Find');
const User = require('../../models/User')


// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/find/add
// @desc 添加信息
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    new Find({
        nickName: req.user[0].nickName,
        avatarUrl: req.user[0].avatarUrl,
        picture: req.body.picture,
        content: req.body.content,
        openId: req.user[0].openId,
        place: req.body.place,
        price: 0
    }).save().then(find => {
        res.json({
            msg: 'Success'
        });
    }).catch(err => {
        res.json(err);
    })
})

module.exports = router;