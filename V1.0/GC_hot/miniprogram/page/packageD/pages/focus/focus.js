// page/packageD//pages/focus/focus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.setNavigationBarTitle({ title: `${options.type}圈` })
    wx.getSystemInfo({
      success(res) {
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#wrapper').boundingClientRect()
        query.exec(function (re) {
          _this.setData({
            height: res.windowHeight - re[0].height
          })
        });
      }
    })
  }
})