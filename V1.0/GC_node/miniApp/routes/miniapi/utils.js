const express = require('express');
const router = express.Router();
const passport = require('passport');
const FeedBack = require('../../models/FeedBack');
const Err = require('../../utils/error');


// $routes /api/utils/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/utils/feedback
// @desc 意见反馈
// @access private
router.get('/feedback', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {
        openId: req.user[0].openId,
        msg: req.query.content,
        picture: req.query.picture == undefined ? '' : req.query.picture,
        type: req.query.type
    }
    new FeedBack(Item).save().then(data => {
        res.json({
            msg: 'Success'
        })
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        });
    })
})

module.exports = router;