const express = require('express');
const router = express.Router();
const passport = require('passport');
const Find = require('../../models/Find');
const Err = require('../../utils/error');
const User = require('../../models/User')


// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access public
router.get('/ceshi', (req, res) => {
    res.json({ msg: "成功" })
})

// $routes /mini/find/add
// @desc 添加信息
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    new Find({
        nickName: req.user[0].nickName,
        avatarUrl: req.user[0].avatarUrl,
        picture: req.body.picture,
        content: req.body.content,
        openId: req.user[0].openId,
        place: req.body.place,
        price: 0
    }).save().then(find => {
        res.json({
            msg: 'Success'
        });
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /api/finds
// @desc 获取所有信息
// @access private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let page = req.query.page || 0;
    console.log(page)
    Find.find().skip(page * 10).limit(10).then(find => {
        if (!find) {
            return res.json({
                msg: 'Null'
            });
        }
        res.json(find);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /api/finds/:id
// @desc 获取单个信息
// @access private

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Find.findOne({ _id: req.params.id }).then(find => {
        if (!find) {
            return res.json({
                msg: 'Null'
            });
        }
        res.json(find);
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /api/finds/delete/:id
// @desc 删除
// @access private

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Find.findOneAndRemove({ _id: req.params.id }).then(profile => {
        profile.save().then(profile => {
            res.json(profile);
        })
    }).catch(err => {
        res.json(err);
    })
})

module.exports = router;