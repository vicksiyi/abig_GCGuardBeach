const keys = require('../config/keys')
const request = require('request');
/**
 * 获取access_token
 * @return 响应的数据
 */
const access_token = () => {
    let access_token = {}
    request.get(`${keys.mini_token_url}?grant_type=client_credential&appid=${keys.APPID}&secret=${keys.SECRET}`, function (error, response, body) {
        access_token = JSON.parse(body).access_token
    })
    return access_token
}

module.exports = {
    access_token: access_token
}