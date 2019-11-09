const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const passport = require('passport');
const request = require('request');
const cheerio = require('cheerio')
const Entities = require('html-entities').XmlEntities;
const randomUA = require('../../utils/userAgent').randomUA;
const Err = require('../..//utils/error');
const New = require('../../models/New');
const Video = require('../../models/Video');




/**
 * 获取搜狐视频里面的视频链接
 * @param {*} url 链接
 * @return 搜狐视频链接
 */
const get_video_sohu = async (url) => {
    let vid = url.split("?")[1].split("bid=")[1].split("&")[0]
    let url_sohu = `https://my.tv.sohu.com/play/videonew.do?vid=${vid}`
    let get_url = 'https://data.vod.itc.cn/ip'
    let mp4_url = ''
    try {
        const request_data = await superagent.get(url_sohu).set(
            "User-Agent", randomUA()
        );
        let news = JSON.parse(request_data.text).data.su[0]
        const request_url = await superagent.get(`${get_url}?new=${news}`).set(
            "User-Agent", randomUA()
        );
        mp4_url = JSON.parse(request_url.text).servers[0].url
    } catch (err) {
        throw {
            msg: 'error 404'
        }
    }
    return mp4_url
}

// $routes /api/find/ceshi
// @desc 返回请求的json数据
// @access private
router.get('/ceshi', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: "成功" })
})


// $routes /mini/news/showNews
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
    console.log("you")
    Video.find().skip(req.query.page * 10).limit(10).then(Video => {
        res.json(Video)
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

// $routes /mini/news/video
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
    } else {
        res.json({
            msg: 'Null'
        })
    }
})

// $routes /mini/news/video
// @desc 更新搜狐视频(链接过期问题)
// @access private
router.post('/updateVideo', passport.authenticate('jwt', { session: false }), (req, res) => {
    New.findOne({
        _id: req.body._id
    }).then(NewData => {
        let content = NewData.new_content;
        const $ = cheerio.load(content);
        if ($("video").attr("src")) {
            (async () => {
                let result = await get_video_sohu(req.body.url);
                let newVideo = $(`<video src=${result}> </video>`);
                let newsFileds = {};
                $("video").replaceWith(newVideo);
                entities = new Entities(); // 解码
                newsFileds.new_content = entities.decode($.html());
                // 更新
                New.findOneAndUpdate({ _id: req.body._id }, { $set: newsFileds }, { new: true }).then(New => {
                    res.json(New);
                }).catch(err => {
                    Err.ErrorFuc(err, req.originalUrl)
                    res.json(err);
                })
            })()
        } else {
            res.json(NewData)
        }
    }).catch(err => {
        Err.ErrorFuc(err, req.originalUrl)
        res.json(err);
    })
})

module.exports = router;