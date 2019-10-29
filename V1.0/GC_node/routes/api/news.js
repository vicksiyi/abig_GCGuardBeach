const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router();
const passport = require('passport');
const Entities = require('html-entities').XmlEntities;
const randomUA = require('../../utils/userAgent').randomUA;
const ErrorLog = require('../../models/ErrorLog')
const New = require('../../models/New')
const Video = require('../../models/Video')


// 错误日志
const ErrorFuc = (err, url) => {
    new ErrorLog({
        url: url,
        log: JSON.stringify(err)
    }).save().then(AdminLog => {
        console.log(AdminLog)
    })
}


// 清洗html
const clean_html = (html) => {
    try {
        const $ = cheerio.load(html)
        $('a').remove()
        return $.html()
    } catch (err) {
        throw {
            msg: 'error 404'
        }
    }
}

// 获取视频数据
const list_video = ($) => {
    try {
        // 获取数据
        let dataTemp = $('script').filter('#_page_data')[0].children[0].data;
        let data_json = JSON.parse(dataTemp.split("window.__PRELOADED_STATE__ =")[1].split(";")[0])

        return data_json
    } catch (err) {
        throw {
            msg: 'error 404'
        }
    }
}
router.get('/ceshi', (req, res) => {
    console.log(randomUA())
})

// $routes /api/news/select/:num
// @desc 推荐新闻列表获取->(管理员端)
// @access public
router.get('/select/:num', (req, res) => {
    let url = "http://search.sohu.com/search/meta"
    let keyword = req.body["keyword"]
    let num = req.params.num
    let spider_url = encodeURI(`${url}?keyword=${keyword}&terminalType=pc&spm-pre=smpc.content.search-box.1.1572234057599y7tr5RL&SUV=1908090048509410&searchType=news&from=${num}`);
    (async () => {
        try {
            const request_data = await superagent.get(spider_url).set(
                "User-Agent", randomUA()
            );
            console.log(request_data.req)
            let data = JSON.parse(request_data.text)
            res.json(data.data.news)
            // spider_page(data.data.news[1].url, req, res)
        } catch (err) {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    })();
})

// $routes /api/news/video
// @desc 视频列表获取->(管理员端)
// @access public
router.get('/video', (req, res) => {
    let url = "https://haokan.baidu.com/videoui/page/pc/search"
    let keyword = req.body["keyword"]
    let spider_url = encodeURI(`${url}?query=${keyword}`);
    (async () => {
        try {
            const request_data = await superagent.get(spider_url).set(
                "User-Agent", randomUA()
            );
            const $ = cheerio.load(request_data.text)
            // 获取数据
            let data_json = list_video($)
            res.json(data_json.list);
        } catch (err) {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    })();
})


// $routes /api/news/addNews
// @desc 发布新闻到小程序端
// @access private
router.get('/addNews', passport.authenticate('jwt', { session: false }), (req, res) => {
    (async () => {
        try {
            const request_data = await superagent.get(req.body["url"]).set(
                "User-Agent", randomUA()
            );
            const $ = cheerio.load(request_data.text)
            let title = $('div.text-title h1').text().replace(/\s+/g, ""); // 标题
            let time = $('div.article-info span.time').text().replace(/\s+/g, ""); // 时间
            let from = $('div.article-info span a').text().replace(/\s+/g, ""); // 来源
            let content_temp = $('article.article').html(); // 正文
            let content = clean_html(content_temp); // 清洗content
            entities = new Entities(); // 解码

            New.findOne({ new_title: title }).then(NewTitle => {
                if (!NewTitle) {
                    new New({
                        new_title: title,
                        new_time: time,
                        new_from: from,
                        new_type: req.body["type"],
                        new_image: req.body["image"],
                        new_content: entities.decode(content)
                    }).save().then(New => {
                        res.json(New)
                    }).catch(err => {
                        ErrorFuc(err, req.originalUrl)
                        res.json(err);
                    })
                } else {
                    res.json({
                        msg: 'Existing'
                    })
                }
            }).catch(err => {
                ErrorFuc(err, req.originalUrl)
                res.json(err);
            })
        } catch (err) {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    })();
})


// $routes /api/news/addVideos
// @desc 发布视频到小程序端
// @access private
router.get('/addVideos', passport.authenticate('jwt', { session: false }), (req, res) => {
    (async () => {
        try {
            // const request_data = await superagent.get(req.body["url"]).set(
            //     "User-Agent", randomUA()
            // );
            const request_data = await superagent.get(req.body["video_proto_url"]).set(
                "User-Agent", randomUA()
            );
            if (request_data.status == 200) {
                const $ = cheerio.load(request_data.text);
                // 获取数据
                let data_json = list_video($)
                // 保存
                Video.findOne({ video_id: data_json.curVideoMeta.id }).then(Video => {
                    if (!Video) {
                        res.json({
                            video_title: data_json.curVideoMeta.title,
                            video_id: data_json.curVideoMeta.id,
                            video_author: req.body["video_author"],
                            video_duration: data_json.curVideoMeta.time_length,
                            video_image: data_json.curVideoMeta.poster,
                            video_read_num: 0,
                            video_proto_url: req.body["video_proto_url"],
                            video_url: data_json.curVideoMeta.playurl
                        })

                    } else {
                        res.json({
                            msg: 'Existing'
                        })
                    }
                }).catch(err => {
                    ErrorFuc(err, req.originalUrl)
                    res.json(err);
                })
            }else{
                res.json({
                    msg : 'An unknown error'
                })
            }
            // res.writeHead(200, { 'Content-Type': 'video/mp4' });
            // let rs = fs.createReadStream(data_json.curVideoMeta.playurl);
            // rs.pipe(res)

            // rs.on('end', function () {
            //     res.end();
            //     console.log('end call');
            // });

        } catch (err) {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    })();
})

module.exports = router;