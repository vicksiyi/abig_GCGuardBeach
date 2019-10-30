const express = require('express');
const router = express.Router();
const keys = require('../../config/keys');
const passport = require('passport');


// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

module.exports = router;