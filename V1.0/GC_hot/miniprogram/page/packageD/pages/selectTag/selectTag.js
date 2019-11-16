const request = require("../../../../utils/requests");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    value: [
      {
        title: '海洋生活',
        select: [
          {
            image: 'http://img5.imgtn.bdimg.com/it/u=3993755434,1758427715&fm=26&gp=0.jpg',
            type: '今日趣事'
          },
          {
            image: 'http://img5.imgtn.bdimg.com/it/u=3993755434,1758427715&fm=26&gp=1.jpg',
            type: '每日分享'
          }
        ]
      },
      {
        title: '海洋冒险',
        select: [
          {
            image: 'http://img4.imgtn.bdimg.com/it/u=3331825918,3533461936&fm=26&gp=2.jpg',
            type: '今日冒险'
          }
        ]
      },
      {
        title: '其他生活',
        select: [
          {
            image: 'http://img5.imgtn.bdimg.com/it/u=2262866020,1150503769&fm=26&gp=3.jpg',
            type: '其他事情'
          }
        ]
      }
    ],
    selected: '',
    valueItem: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      selected: _this.data.value[0].title,
      valueItem: _this.data.value[0].select
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.showTag(res.data)
      }
    })
  },
  // 标签
  showTag: function (token) {
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/showType`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    request.requestUtils(Item, res => {
      console.log(res)
    })
  },
  select: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset
    _this.setData({
      selected: index.title,
      valueItem: _this.data.value[index.id].select
    })
  }
})