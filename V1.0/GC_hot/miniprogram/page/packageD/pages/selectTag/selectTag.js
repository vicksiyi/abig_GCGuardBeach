const request = require("../../../../utils/requests");
const app = getApp();
const Utils = require("../../../../utils/util");
const utils = new Utils();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    value: [],
    selected: '',
    valueItem: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.showTag(res.data)
      }
    })
  },
  // 标签
  showTag: function (token) {
    let _this = this
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/showType`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    request.requestUtils(Item, res => {
      let result = utils.aggregationFunc(res)
      _this.setData({
        value: result
      })
      _this.setData({
        selected: result[0].title,
        valueItem: result[0].select
      })
    })
  },
  select: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset
    _this.setData({
      selected: index.title,
      valueItem: _this.data.value[index.id].select
    })
  },
  selectType: function (e) {
    wx.setStorage({
      key: "type",
      data: e.currentTarget.dataset.type
    })
    wx.navigateBack({
      delta: 1
    })
  }
})