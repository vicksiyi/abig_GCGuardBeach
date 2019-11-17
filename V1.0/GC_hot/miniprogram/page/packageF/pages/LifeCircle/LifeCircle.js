const app = getApp()
const request = require('../../../../utils/requests');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ["全部", "关注", "精选"],
    selectList: '全部',
    height: 0,
    value: [],
    valueFocus: [],
    valueSelect: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        _this.getLife(res.data, 0, result => {
          _this.setData({
            value: result
          })
        })
      }
    })
  },

  // 列表事件
  listChange: function (e) {
    let _this = this
    _this.setData({
      selectList: _this.data.list[e.currentTarget.dataset.id],
      current: e.currentTarget.dataset.id
    })
  },
  // 滑动改变
  currentChange: function (e) {
    let _this = this
    _this.setData({
      selectList: _this.data.list[e.detail.current]
    })
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.image,
      current: e.currentTarget.dataset.url
    })
  },
  write: function () {
    wx.navigateTo({
      url: '../../../packageD/pages/write/write'
    })
  },
  getLife: function (token, page, back) {
    let _this = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/show?page=${page}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    try {
      request.requestUtils(Item, result => {
        wx.hideLoading()
        back(result)
      })

    } catch (err) {
      console.log(err)
    }
  }
})