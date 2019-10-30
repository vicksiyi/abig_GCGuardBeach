const Utils = require("../../../../utils/util")
const utils = new Utils()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    value: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    _this.setData({
      spinShow: true
    })
    const db = wx.cloud.database()
    let numRandom = utils.randomNumOneToOne(0, 6)
    db.collection('abig_kong_knowledge').where({
      num: numRandom
    }).get({
      success: function (res) {
        _this.setData({
          value: res.data[0],
          spinShow: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})