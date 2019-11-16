const requestUtils = (options, back) => {
    let tempRequest = {}
    wx.request({
        url: options.url || '',
        data: options.data || '',
        method: options.method || 'GET',
        header: options.header || '',
        success(s) {
            // s.data.msg = 'success'
            back(s.data)
        },
        fail(err) {
            console.log(err)
        }
    })
}
module.exports = {
    requestUtils: requestUtils
}