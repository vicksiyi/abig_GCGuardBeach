const ErrorLog = require('../models/ErrorLog')
/**
 * 错误日志
 * @param {*} err 错误
 * @param {*} url 接口
 */
const ErrorFuc = (err, url) => {
    new ErrorLog({
        url: url,
        log: JSON.stringify(err)
    }).save().then(AdminLog => {
        console.log(AdminLog)
    })
}

module.exports = {
    ErrorFuc: ErrorFuc
}