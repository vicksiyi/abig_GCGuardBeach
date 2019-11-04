const express = require('express');
const router = express.Router();
const passport = require('passport');

// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/chats/send
// @desc 保存消息
// @access private
router.post('/addMsg', passport.authenticate('jwt', { session: false }), (req, res) => {
    
})

module.exports = router;