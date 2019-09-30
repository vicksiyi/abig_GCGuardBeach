Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderCarts: [], //存放数据
    state: "等待兑换",
    status: "未开始",
    time: "2019-09-18"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.getStorage({
      key: 'selecterList',
      success(res) {
        // console.log(res.data)
        _this.setData({
          orderCarts: JSON.parse(res.data)
        })
      }
    })
  },
})