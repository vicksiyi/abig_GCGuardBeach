const requestUtils = (options) => {
    let tempRequest = {}
    wx.request({
        url: options.url || '',
        data: options.data || '',
        method: options.method || '',
        header: options.header || '',
        success(s) {
            // s.data.msg = 'success'
            tempRequest = s.data
        },
        fail(err) {
            // tempRequest = {
            //     msg: 'error'
            // }
            console.log(err)
        }
    })
    // 定时器&5秒超时
    var time =  setTimeout(() => {
        console.log('停止')
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("超时")
            }, 0);
        })
    }, 5000)

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            clearTimeout(time)
            resolve(tempRequest)
        }, 2000);
    })
}

module.exports = {
    requestUtils: requestUtils
}