const request = require("../../../../utils/requests")
const { $Message } = require('../../../../dist/base/index');
const app = getApp()
Page({
  data: {
    userInfo: {},
    spinShow: false
  },
  onLoad: function (options) {
    let _this = this
    // if (options.email != undefined) {
    //   _this.setData({
    //     'userInfo.email': options.email
    //   })
    // }
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        let Item = {
          url: `http://${app.ip}:5001/mini/users/user`,
          header: {
            'Authorization': res.data
          }
        };
        request.requestUtils(Item, result => {
          console.log(result)
          _this.setData({
            userInfo: result,
            spinShow: false
          })
        })
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
        if (err.errMsg == "chooseAddress:fail auth deny") {
          $Message({
            content: '获取信息失败',
            type: 'error'
          });
          wx.showModal({
            title: '通讯信息获取失败',
            content: '是否进入开启权限页面重新授权',
            confirmText: '确定',
            confirmColor: '#19be6b',
            success(res2) {
              if (res2.confirm) {
                wx.openSetting({
                  success(data) {
                    if (data.authSetting["scope.address"]) {
                      $Message({
                        content: '获取成功',
                        type: 'success'
                      });
                      // 重新加载
                      _this.onLoad()
                    } else {
                      $Message({
                        content: '获取权限失败',
                        type: 'error'
                      });
                    }
                  },
                  fail(err) {
                    console.log(err)
                    $Message({
                      content: '未知错误',
                      type: 'error'
                    });
                  }
                })
              } else {
                $Message({
                  content: '用户取消选择'
                });
              }
            }
          })
        }
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
          url: `http://${app.ip}:5001/mini/users/edit`,
          method: "POST",
          data: _this.data.userInfo,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': res.data
          }
        };
        request.requestUtils(Item, result => {
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
        })
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