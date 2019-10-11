//login & register
const express = require('express');
const router = express.Router();
const OauthUser = require('../../models/OauthUser');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport')


const saltRounds = 10

// $routes /api/oauthUsers/register
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


// $routes GET /api/oauthUsers/users
// @desc 返回请求的json数据
// @access private
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({
    //     email: req.user.email,
    //     name: req.user.name,
    //     identity: req.user.identity
    // });
    OauthUser.find()
        .then(user => {
            res.json(user)
        })
})



// $routes GET /api/oauthUsers/addUsers
// @desc 返回请求的json数据
// @access private
router.post('/addUsers', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({
    //     email: req.user.email,
    //     name: req.user.name,
    //     identity: req.user.identity
    // });
    console.log(req.user)
    if (req.user.identity == "超级管理员") {
        User.findOne({ email: req.body.email })
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
                    new User({
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


module.exports = router;