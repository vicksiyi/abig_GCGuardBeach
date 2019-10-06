//login & register
const express = require('express');
const router = express.Router();
const OauthUser = require('../../models/OauthUser');
const User = require('../../models/User');
const bcrypt = require('bcrypt');


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
module.exports = router;