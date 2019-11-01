const request = require("../../../../utils/requests")
const { $Message } = require('../../../../dist/base/index');
Page({
  data: {
    userInfo: {},
    spinShow: false
  },
  onLoad: function (options) {
    let _this = this
    _this.setData({
      'userInfo.email': options.email
    })
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        let Item = {
          url: 'http://192.168.2.123:5001/mini/users/user',
          header: {
            'Authorization': res.data
          }
        };
        (async () => {
          let result = await request.requestUtils(Item)
          console.log(result)
          _this.setData({
            userInfo: result,
            spinShow: false
          })
        })()
      }
    })
  },
  chooseAddress() {
    let _this = this
    wx.chooseAddress({
      success: (res) => {
        console.log(res)
        _this.setData({
          'userInfo.name_true': res.userName,
          'userInfo.address': res.cityName + res.countyName + res.detailInfo,
          'userInfo.phone': res.telNumber
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  submit: function () {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        let Item = {
          url: 'http://192.168.2.123:5001/mini/users/edit',
          method: "POST",
          data: _this.data.userInfo,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': res.data
          }
        };
        (async () => {
          let result = await request.requestUtils(Item)
          if (result.msg == "Success") {
            $Message({
              content: '修改成功',
              type: 'success'
            });
          } else {
            $Message({
              content: '未知错误',
              type: 'error'
            });
          }
          setTimeout(() => {
            wx.switchTab({
              url: '../../../packageA/mine/mine'
            })
          }, 1000)
        })()
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log(e)
  },
  onShow: function () {
    let _this = this
    wx.getStorage({
      key: 'email',
      success(res) {
        _this.setData({
          'userInfo.email': res.data
        })
      }
    })
  },
  onUnload: function () {
    wx.removeStorage({
      key: 'email',
      success(res) {
        console.log(res)
      }
    })
  }
})