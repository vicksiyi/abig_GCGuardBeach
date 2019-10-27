//login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const Admin = require('../../models/Admin');
const OauthUser = require('../../models/OauthUser');
const AdminLog = require('../../models/AdminLog')
const ErrorLog = require('../../models/ErrorLog')

// 密码加密所需
const saltRounds = 10

// 错误日志
const ErrorFuc = (err, url) => {
    new ErrorLog({
        url: url,
        log: JSON.stringify(err)
    }).save().then(AdminLog => {
        console.log(AdminLog)
    })
}

// $routes /api/admins/register
// @desc 管理员注册->(没字段加密->邮箱未验证)
// @access public
router.post('/register', (req, res) => {
    console.log(req.originalUrl)
    Admin.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.json({
                msg: -1
            })
        } else {
            const newUser = new OauthUser({
                name: req.body.name,
                email: req.body.email,
                identity: '管理员',
                password: req.body.password
            })

            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        throw err
                    } else {
                        newUser.password = hash;
                        newUser.save().then(user => {
                            res.json(user);
                        }).catch(err => {
                            ErrorFuc(err, req.originalUrl)
                            res.json(err);
                        })
                    }
                });
            });
        }
    }).catch(err => {
        ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})



// $routes GET /api/admins/addAdmins/:id
// @desc 通过管理员身份
// @access private
router.get('/addAdmins/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.identity == "超级管理员") {
        OauthUser.findOne({ _id: req.params.id }).then(AdminOauth => {
            console.log(req.query.select)
            Admin.findOne({ email: AdminOauth.email }).then(user => {
                if (user) {
                    OauthUser.findOneAndRemove({ _id: req.params.id }).then(OauthUser => {
                        OauthUser.save()
                            .then(OauthUser => {
                                let item = {
                                    msg: "Existing",
                                    OauthUser
                                }
                                res.json(item);
                            })
                    }).catch(err => {
                        ErrorFuc(err, req.originalUrl)
                        res.json(err);
                    })
                } else {
                    new Admin({
                        name: AdminOauth.name,
                        email: AdminOauth.email,
                        identity: req.query.select,
                        password: AdminOauth.password
                    }).save().then(user => {
                        OauthUser.findOneAndRemove({ email: AdminOauth.email }).then(OauthUser => {
                            OauthUser.save().then(OauthUser => {
                                let item = {
                                    msg: "Success",
                                    OauthUser
                                }
                                res.json(item);
                            })
                        }).catch(err => {
                            ErrorFuc(err, req.originalUrl)
                            res.json(err);
                        })
                    }).catch(err => {
                        ErrorFuc(err, req.originalUrl)
                        res.json(err);
                    })
                }
            })
        }).catch(err => {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        })
    } else {
        res.json({
            msg: "No permissions"
        })
    }
})

// $routes GET /api/admins/showAdmins/:page
// @desc 根据page 返回管理员审核列表
// @access private
router.get('/showAdmins/:page', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.page)
    OauthUser.find().skip(req.params.page * 10).limit(10).then(OauthUser => {
        res.json(OauthUser)
    }).catch(err => {
        ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes GET /api/admins/showAdminNum
// @desc 放回所有数目
// @access private
router.get('/showAdminNum', passport.authenticate('jwt', { session: false }), (req, res) => {
    OauthUser.find().then(OauthUser => {
        res.json({
            len: OauthUser.length
        })
    }).catch(err => {
        ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /api/admins/login
// @desc 管理员登录->(无字段加密)
// @access public
router.post('/login', (req, res) => {
    console.log(req.body["email"])
    OauthUser.findOne({ email: req.body["email"] }).then(user => {
        if (user) {
            return res.json({
                msg: "审核中"
            })
        } else {
            Admin.findOne({ email: req.body["email"] }).then(user => {
                if (!user) {
                    return res.json({
                        msg: 0
                    })
                }
                // 密码匹配
                bcrypt.compare(req.body["password"], user.password).then(isMatch => {
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
            }).catch(err => {
                ErrorFuc(err, req.originalUrl)
                res.json(err);
            })
        }
    }).catch(err => {
        ErrorFuc(err, req.originalUrl)
        res.json(err);
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
// @desc 返回管理员成员数据(超级管理员->操作)
// @access private
router.post('/admins', passport.authenticate('jwt', { session: false }), (req, res) => {
    Admin.find().then(user => {
        if (req.user.identity == "超级管理员") {
            res.json(user)
        } else {
            for (let i = 0; i < user.length; i++) {
                user[i].password = 'No permissions'
            }
            res.json(user)
        }
    }).catch(err => {
        ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /api/admins/deleteAdmin/:id
// @desc 删除管理员->(超级管理员)
// @access private

router.delete('/deleteAdmin/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.identity == "超级管理员") {
        Admin.findOneAndRemove({ _id: req.params.id }).then(Admin => {
            Admin.save().then(Admin => {
                // res.json(Admin);
                new AdminLog({
                    type: 'Delete',
                    log: JSON.stringify(Admin)
                }).save().then(AdminLog => {
                    console.log(AdminLog)
                })
            })
        }).catch(err => {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        })
    } else {
        res.json({
            msg: "No permissions"
        })
    }
})


module.exports = router;