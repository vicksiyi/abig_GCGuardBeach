const request = require('../../../../utils/requests');
const app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    value: {},
    baseUrl: 'cloud://kkworkspace-4sdw7.6b6b-kkworkspace-4sdw7-1300292448/store/',
    msgTitle: '邀请您一起过来领奖品',
    token: '',
    _id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      _id: options._id
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        })
        _this.getMsg(res.data, options._id, result => {
          wx.setNavigationBarTitle({ title: result.name })
          _this.setData({
            value: result
          })
        })
      },
      fail() {
        // wx.setStorage({
        //   key: "back",
        //   data: options._id
        // })
        wx.switchTab({
          url: '../../../packageA/index/index'
        })
      }
    })
  },
  // 获取数据
  getMsg: function (token, id, back) {
    let Item = {
      url: `http://${app.ip}:5001/mini/stores/listOne`,
      data: {
        _id: id
      },
      header: {
        'Authorization': token
      }
    };
    request.requestUtils(Item, result => {
      back(result)
    })
  },
  /**
   * 用户分享自定义
   */
  onShareAppMessage: function (res) {
    return {
      title: '邀请您一起过来领奖品'
    }
  },
  onShow: function () {
    let _this = this;
    // wx.getStorage({
    //   key: 'Token',
    //   success(res) {
    //     _this.setData({
    //       token: res.data
    //     })
    //     wx.getStorage({
    //       key: 'back',
    //       success(e) {
    //         _this.getMsg(res.data, e.data, result => {
    //           wx.setNavigationBarTitle({ title: result.name })
    //           _this.setData({
    //             value: result
    //           })
    //         })
    //       }
    //     })
    //   },
    //   fail() {
    //     wx.setStorage({
    //       key: "back",
    //       data: options._id
    //     })
    //     wx.switchTab({
    //       url: '../../../packageA/index/index'
    //     })
    //   }
    // })
  }
})