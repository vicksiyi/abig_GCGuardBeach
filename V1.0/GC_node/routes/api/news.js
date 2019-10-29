const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio')
const router = express.Router();
const passport = require('passport');
const Entities = require('html-entities').XmlEntities;
const randomUA = require('../../utils/userAgent').randomUA;
const ErrorLog = require('../../models/ErrorLog')
const New = require('../../models/New')


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

router.get('/ceshi', (req, res) => {
    console.log(randomUA())
})

// $routes /api/news/select/:num
// @desc 推荐列表获取
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


// $routes /api/news/addNews
// @desc 发布到小程序端
// @access private
router.get('/addNews', passport.authenticate('jwt', { session: false }), (req, res) => {
    (async () => {
        try {
            const request_data = await superagent.get(req.body["url"]);
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

module.exports = router;