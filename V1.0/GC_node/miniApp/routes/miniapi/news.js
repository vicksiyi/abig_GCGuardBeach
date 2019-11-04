const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const fs = require('fs')
const Err = require('../..//utils/error');
const New = require('../../models/New');

// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access private
router.get('/ceshi', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: "成功" })
})


// $routes /mini/news/show
// @desc 获取新闻列表
// @access private
router.get('/showNews', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json(req.query.type)
    New.find({
        new_type: req.query.type
    }).skip(req.query.page * 10).limit(10).then(New => {
        res.json(New)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})


// $routes /mini/news/showVideos
// @desc 获取视频列表
// @access private
router.get('/showVideos', passport.authenticate('jwt', { session: false }), (req, res) => {
    Video.find().skip(req.query.page * 10).limit(10).then(Video => {
        res.json(Video)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/news/showVideos
// @desc 解析视频
// @access private
router.get('/video', (req, res) => {
    // let video_name = req.query.video_url.split("?")[0].split("/").pop()
    if (req.query.video_url != undefined) {
        try {
            res.writeHead(200, { 'Content-Type': 'video/mp4' });
            (async () => {
                let data = await request(req.query.video_url).on('error', function (err) {
                    Err.ErrorFuc(err, req.originalUrl)
                    res.json(err);
                }).pipe(res)

                data.on('open', () => {
                    console.log('开始读取..');
                });

                data.on('finish', () => {
                    console.log('写入已完成..');
                });
            })()
        } catch (err) {
            Err.ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    }else{
        res.json({
            msg : 'Null'
        })
    }
})


module.exports = router;