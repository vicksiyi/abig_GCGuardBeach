const express = require('express');
const router = express.Router();
const Store = require('../../models/Store');
const passport = require('passport');
const Err = require('../../utils/error')


// $routes /api/stores/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /api/stores/add
// @desc 添加商品
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body.images)
    new Store({
        name: req.body.name,
        imageBg: req.body.imageBg,
        images: JSON.parse(req.body.images),
        msg: req.body.msg,
        money: req.body.money,
        inventory: req.body.inventory,
        type: req.body.type,
        price: req.body.price
    }).save().then(Store => {
        res.json(Store);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

module.exports = router;