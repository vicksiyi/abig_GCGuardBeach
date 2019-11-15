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
    valueSelect: [],
    picture: [
      "https://f10.baidu.com/it/u=752933719,2910359121&fm=72",
      "https://f10.baidu.com/it/u=3350054069,3401952888&fm=72",
      "http://img3.imgtn.bdimg.com/it/u=3846934696,94519349&fm=26&gp=0.jpg",
      "http://img0.imgtn.bdimg.com/it/u=3487785566,2694268244&fm=26&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=3379661414,1149353874&fm=26&gp=0.jpg",
      "http://img5.imgtn.bdimg.com/it/u=2394242552,2024191525&fm=26&gp=0.jpg",
      "http://img1.imgtn.bdimg.com/it/u=2503161458,3326084877&fm=26&gp=0.jpg",
      "http://img1.imgtn.bdimg.com/it/u=3847857250,4054804645&fm=26&gp=0.jpg",
      "http://img0.imgtn.bdimg.com/it/u=3400507779,684511797&fm=26&gp=0.jpg"
    ],
    picture1: [
      "http://img1.imgtn.bdimg.com/it/u=3847857250,4054804645&fm=26&gp=0.jpg",
      "http://img0.imgtn.bdimg.com/it/u=3400507779,684511797&fm=26&gp=0.jpg"
    ],
    picture2: [
      "https://f10.baidu.com/it/u=752933719,2910359121&fm=72",
      "https://f10.baidu.com/it/u=3350054069,3401952888&fm=72",
      "http://img1.imgtn.bdimg.com/it/u=2503161458,3326084877&fm=26&gp=0.jpg",
      "http://img1.imgtn.bdimg.com/it/u=3847857250,4054804645&fm=26&gp=0.jpg",
      "http://img0.imgtn.bdimg.com/it/u=3400507779,684511797&fm=26&gp=0.jpg"
    ]

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
  }
})