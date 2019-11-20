const express = require('express');
const router = express.Router();
const passport = require('passport');
const Store = require('../../models/Store');
const Err = require('../../utils/error');


// $routes /api/utils/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/utils/list
// @desc 物品获取
// @access private
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
    Store.find().then(data => {
        res.json(data)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

// $routes /mini/utils/listOne
// @desc 物品获取(单个)
// @access private
router.get('/listOne', passport.authenticate('jwt', { session: false }), (req, res) => {
    Store.findOne({ _id: req.query._id }).then(data => {
        res.json(data)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json({
            msg: 'Error'
        })
    })
})

module.exports = router;