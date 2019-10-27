//login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const userDecrypt = require('../../utils/userDecrypt')
const User = require('../../models/User');

// $routes /api/users/register
// @desc 返回请求的json数据
// @access public
router.post('/register', (req, res) => {
    console.log("暂无")
})


// $routes /api/users/login
// @desc 返回请求的json数据
// @access public
router.post('/login', (req, res) => {
    console.log("暂无")
})


module.exports = router;