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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(tempRequest)
        }, 2000);
    })
}

module.exports = {
    requestUtils: requestUtils
}