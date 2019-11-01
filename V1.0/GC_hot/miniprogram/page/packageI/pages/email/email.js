const { $Message } = require('../../../../dist/base/index');
const request = require('../../../../utils/requests');
const Utils = require('../../../../utils/util');
const utils = new Utils();
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '发送验证码',
    email: '',
    btnDisable: false,
    subDisabled: true,
    value2: '',
    numTest: '',
    numTemp: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Message({
      content: '仅支持国内用户'
    });
  },
  valPhone: function () {
    let _this = this
    let Token = ''
    let num = _this.data.msg
    console.log(_this.data.email)
    if (!(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(_this.data.email))) {
      $Message({
        content: '请输入正确的邮箱号',
        type: 'warning'
      });
      return
    }
    if (num == '发送验证码' || num == "重新发送") {
      num = 59;
      _this.setData({
        btnDisable: true
      })
    }
    let dao = setInterval(() => {
      _this.setData({
        msg: num--
      })
      if (num == 0) {
        clearInterval(dao)
        _this.setData({
          btnDisable: false,
          msg: '重新发送'
        })
      }
    }, 1000);
    let numTemp = utils.randomNumOneToOne(1000, 9999);
    _this.setData({
      numTemp: numTemp
    })
    let item = {
      email: _this.data.email,
      num: numTemp
    }
    wx.getStorage({
      key: 'Token',
      success(res) {
        Token = res.data
      },
      complete() {
        let Item = {
          url: `http://${app.ip}:5001/mini/emails/send`,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': Token
          },
          data: item
        };
        (async () => {
          let result = await request.requestUtils(Item, 5000)
          if (result.msg == "Success") {
            _this.setData({
              numTest: result.num,
              subDisabled: false
            })
            $Message({
              content: '发送成功',
              type: 'success'
            });
          } else {
            console.log(result)
            $Message({
              content: '未知错误',
              type: 'error'
            });
            setTimeout(() => {
              wx.switchTab({
                url: '../../../packageA/mine/mine'
              })
            }, 1000)
          }
        })()
      }
    })
  },
  changeEmail: function (e) {
    this.setData({
      email: e.detail.detail.value
    })
  },
  submit: function () {
    let _this = this
    if (_this.data.value2.length != 4) {
      $Message({
        content: '请输入正确的验证码',
        type: 'warning'
      });
      return
    }
    if (_this.data.value2 == _this.data.numTemp) {

      $Message({
        content: '验证成功',
        type: 'success'
      });
      wx.setStorage({
        key: "email",
        data: _this.data.email,
        complete() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }
      })
    } else {
      $Message({
        content: '验证码错误,请重新输入',
        type: 'error'
      });
    }
  },
  changeValue2: function (e) {
    this.setData({
      value2: e.detail.detail.value + ''
    })
  }
})