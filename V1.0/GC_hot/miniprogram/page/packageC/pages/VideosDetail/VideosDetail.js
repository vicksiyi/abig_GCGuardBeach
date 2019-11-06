const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: 'http://192.168.2.123:5001/mini/news/video?video_url=https://vd4.bdstatic.com/mda-jjj6d9gk23w64fey/mda-jjj6d9gk23w64fey.mp4?auth_key=1572356614-0-0-7be48ef3b26d38ad438117da9d5503d9&bcevod_channel=searchbox_feed',
    windowHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
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