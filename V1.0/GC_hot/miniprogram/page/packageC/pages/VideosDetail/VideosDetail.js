const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    windowHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this

    wx.setNavigationBarTitle({ title: options.title })

    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'video',
      success(res) {
        let url = `http://${app.ip}:5001/mini/news/video?video_url=${res.data}`
        _this.setData({
          videoUrl: url
        })
      }
    })
  }
})