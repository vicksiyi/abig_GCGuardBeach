const request = require("../../../../utils/requests")
const { $Message } = require('../../../../dist/base/index');
Page({
  data: {
    userInfo: {},
    spinShow: false
  },
  onLoad: function () {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        let Item = {
          url: 'http://localhost:5001/mini/users/user',
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
        _this.setData({
          'userInfo.name_true': res.userName,
          'userInfo.address': res.cityName + res.countyName + res.detailInfo
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
          url: 'http://localhost:5001/mini/users/edit',
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
  }
})