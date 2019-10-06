//login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


const saltRounds = 10

// $routes /api/users/register
// @desc 返回请求的json数据
// @access public
router.post('/register', (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.json({
                    msg: -1
                })
            } else {
                // const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    identity: '管理员',
                    password: req.body.password
                })


                // bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                //     if (err) {
                //         throw err
                //     } else {
                //         newUser.password = hash;
                //         newUser.save()
                //             .then(user => {
                //                 res.json(user);
                //             })
                //             .catch(err => {
                //                 console.log(err);
                //             })
                //     }
                // });
                // -------------------------data and salt arguments required(文件为空)

                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) {
                            throw err
                        } else {
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    res.json(user);
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                    });
                });
            }
        })
})

// $routes /api/users/login
// @desc 返回请求的json数据
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.json({
                    msg: 0
                })
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { id: user.id, name: user.name }
                        jwt.sign(rule, keys.secretOrket, { expiresIn: 3600 }, (err, token) => {
                            if (err) {
                                throw err;
                            } else {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            }
                        })
                    } else {
                        return res.json({
                            msg: -1
                        });
                    }
                })
        })
})

// $routes GET /api/users/current
// @desc 返回请求的json数据
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        email: req.user.email,
        name: req.user.name,
        identity: req.user.identity
    });
})


// $routes GET /api/users/users
// @desc 返回请求的json数据
// @access private
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({
    //     email: req.user.email,
    //     name: req.user.name,
    //     identity: req.user.identity
    // });
    User.find()
        .then(user => {
            if (req.user.identity == "超级管理员") {
                res.json(user)
            } else {
                for (let i = 0; i < user.length; i++) {
                    user[i].password = '你没此权限'
                }
                res.json(user)
            }
        })
})

module.exports = router;