Page({

  data: {
    text: "光与影的世界里，如果你努力发现美好，美好也会找到你。进入圈子发现美好吧！o(*￣▽￣*)ブ",
    spinShow: true
  },
  //跳转到发现圈
  find: function () {
    wx.navigateTo({
      url: '../../packageF/pages/FindCircle/FindCircle',
    })
  },
  imageLoad: function () {
    this.setData({
      spinShow: false
    })
  }
})