//login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const Admin = require('../../models/Admin');
const OauthUser = require('../../models/OauthUser');


const saltRounds = 10

// $routes /api/admins/register
// @desc 管理员注册->(没字段加密->邮箱未验证)
// @access public
router.post('/register', (req, res) => {
    console.log(req.body)
    Admin.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.json({
                    msg: -1
                })
            } else {
                // const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new OauthUser({
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



// $routes GET /api/admins/addAdmins
// @desc 返回请求的json数据
// @access private
router.post('/addAdmins', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.identity == "超级管理员") {
        Admin.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    OauthUser.findOneAndRemove({ email: req.body.email })
                        .then(OauthUser => {
                            OauthUser.save()
                                .then(OauthUser => {
                                    let item = {
                                        msg: 0,
                                        OauthUser
                                    }
                                    res.json(item);
                                })
                        })
                        .catch(err => {
                            res.json(err);
                        })
                } else {
                    new Admin({
                        name: req.body.name,
                        email: req.body.email,
                        identity: req.body.selecte,
                        password: req.body.password
                    }).save()
                        .then(user => {
                            OauthUser.findOneAndRemove({ email: req.body.email })
                                .then(OauthUser => {
                                    OauthUser.save()
                                        .then(OauthUser => {
                                            let item = {
                                                msg: 1,
                                                OauthUser
                                            }
                                            res.json(item);
                                        })
                                })
                                .catch(err => {
                                    res.json(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
    } else {
        res.json({
            msg: -1
        })
    }

})

// $routes /api/admins/login
// @desc 管理员登录->(有字段加密)
// @access public
router.post('/login', (req, res) => {
    console.log(req.body["email"])
    OauthUser.findOne({ email: req.body["email"] })
        .then(user => {
            if (user) {
                return res.json({
                    msg: "审核中"
                })
            } else {
                Admin.findOne({ email: req.body["email"] })
                    .then(user => {
                        if (!user) {
                            return res.json({
                                msg: 0
                            })
                        }
                        // 密码匹配
                        bcrypt.compare(req.body["password"], user.password)
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
            }
        })
})

// $routes GET /api/admins/current
// @desc 根据token返回用户信息
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        email: req.user.email,
        name: req.user.name,
        identity: req.user.identity
    });
})


// $routes POST /api/admins/admins
// @desc 返回管理员成员数据
// @access private
router.post('/admins', passport.authenticate('jwt', { session: false }), (req, res) => {
    Admin.find()
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