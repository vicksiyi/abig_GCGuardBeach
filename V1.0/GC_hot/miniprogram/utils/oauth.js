const app = getApp()
function Oauth() { }
// 缓存Token
Oauth.prototype.loginUser = () => {
    wx.login({
        success: res => {
            if (res.code) {
                let item = {}
                wx.getUserInfo({
                    success: function (e) {
                        item.iv = e.iv;
                        item.encryptedData = e.encryptedData
                    },
                    complete() {
                        item.code = res.code
                        // 获取token
                        wx.request({
                            url: `http://${app.ip}:5001/mini/users/oauth`,
                            data: item,
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success(data) {
                                wx.setStorage({
                                    key: "Token",
                                    data: data.data.token
                                })
                            }
                        })
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}

module.exports = Oauth
