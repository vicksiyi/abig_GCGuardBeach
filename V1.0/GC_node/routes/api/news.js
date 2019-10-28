const express = require('express');
const superagent = require('superagent');
const router = express.Router();
const ErrorLog = require('../../models/ErrorLog')


// 错误日志
const ErrorFuc = (err, url) => {
    new ErrorLog({
        url: url,
        log: JSON.stringify(err)
    }).save().then(AdminLog => {
        console.log(AdminLog)
    })
}


// 文章内容抓取
const spider_page = (url) => {
    console.log(url)
}

// $routes /api/news/select/:keyword/:num
// @desc 推荐列表获取
// @access public
router.get('/select/:num', (req, res) => {
    let url = "http://search.sohu.com/search/meta"
    let keyword = '海滩环境'
    let num = req.params.num
    let spider_url = encodeURI(`${url}?keyword=${keyword}&terminalType=pc&spm-pre=smpc.content.search-box.1.1572234057599y7tr5RL&SUV=1908090048509410&searchType=news&from=${num}`);
    (async () => {
        try {
            const request_data = await superagent.get(spider_url);
            let data = JSON.parse(request_data.text)
            res.json(data)
        } catch (err) {
            ErrorFuc(err, req.originalUrl)
            res.json(err);
        }
    })();
})

module.exports = router;