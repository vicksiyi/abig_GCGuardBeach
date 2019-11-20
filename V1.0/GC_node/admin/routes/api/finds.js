const express = require('express');
const router = express.Router();
const Find = require('../../models/Find');


// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /api/find/add
// @desc 添加信息
// @access private
router.post('/add', (req, res) => {
    new Find({
        name: req.body.name,
        avatar: req.body.avatar,
        picture: req.body.picture,
        content: req.body.content,
        openid: req.body.openid,
        place: req.body.place,
        price: 0
    }).save().then(find => {
        res.json(find);
    }).catch(err=>{
        res.json(err);
    })
})

module.exports = router;