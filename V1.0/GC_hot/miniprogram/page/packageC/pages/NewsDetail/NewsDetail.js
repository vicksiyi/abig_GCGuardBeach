const WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataNews: [],
    spinShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'dataNews',
      success(res) {
        let dataTemp = JSON.parse(res.data)
        _this.setData({
          dataNews: dataTemp,
          spinShow: false
        })
        var article = dataTemp.new_content

        WxParse.wxParse('article', 'html', article, _this, 5);
      }
    })
  }
})