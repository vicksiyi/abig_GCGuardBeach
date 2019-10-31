const { $Message } = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '发送验证码',
    phone: '',
    btnDisable: false,
    subDisabled: true,
    value2: ''
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
    let num = _this.data.msg
    if (!(/^1[3456789]\d{9}$/.test(_this.data.phone))) {
      $Message({
        content: '请输入正确的手机号码',
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

    wx.cloud.callFunction({
      name: 'sendsms',
      data: {
        mobile: '13336535215',
        nationcode: '86',
        num: 3368
      },
      success: res => {
        _this.setData({
          subDisabled: false
        })
      },
      fail: err => {
        console.error('[云函数] [sendsms] 调用失败', err)
      }
    })
  },
  changePhone: function (e) {
    this.setData({
      phone: e.detail.detail.value
    })
  },
  submit: function () {
    if (this.data.value2.length == 4) {
      $Message({
        content: '请输入正确的验证码',
        type: 'warning'
      });
      return
    }
    $Message({
      content: '修改成功',
      type: 'success'
    });
    setTimeout(() => {
      wx.switchTab({
        url: '../../../packageA/mine/mine'
      })
    }, 1000);
  },
  changeValue2: function (e) {
    this.setData({
      value2: e.detail.detail.value
    })
  }
})