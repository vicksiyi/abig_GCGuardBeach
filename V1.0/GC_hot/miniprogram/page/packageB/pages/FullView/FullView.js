Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadImage: [],
    spinShow: true,

  },
  imageLoad: function (e) {
    this.setData({
      spinShow: false
    })
  }
})