const app = getApp()
const request = require('../../../utils/requests')
Page({
  data: {
    current: 1,
    currentTabsIndex: 0,
    windowHeight: '',
    playBtn: false,
    fullscreen: true,
    show_pro: true,
    dir: 'horizontal',
    push: [
      {
        name: '社会',
        checked: false,
        color: 'default'
      },
      {
        name: '财经',
        checked: false,
        color: 'red'
      },
      {
        name: '美食',
        checked: true,
        color: 'blue'
      },
      {
        name: '科普',
        checked: true,
        color: 'green'
      },
      {
        name: '艺术',
        checked: true,
        color: 'yellow'
      }
    ],
    videos: [],
    hot: [],
    spinLoad: false,
    keys: ['社会', '视频', '热点', '搞笑'],
    keys2: ['社会', '财经', '美食', '科普', '艺术']
  },
  handleChange({ detail }) {
    let _this = this
    _this.setData({
      current: detail.key,
      currentTabsIndex: 0
    });
    console.log(detail)
    if (detail.key != 1) {
      _this.getNews(_this.data.keys[detail.key], 0)
    } else {
      _this.getVideos(0)
    }
  },
  screenChange(e) {
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      this.setData({
        controls: false
      })
    } else { //进入全屏
      this.setData({
        controls: true
      })
    }
  },
  onTabsItemTap: function (event) {
    let _this = this
    var index = event.currentTarget.dataset.index;
    _this.setData({
      currentTabsIndex: index
    });
    _this.getNews(_this.data.keys2[index], 0)
  },
  godetail: function (e) {
    console.log(e.currentTarget.dataset.data)
    wx.setStorage({
      key: "dataNews",
      data: JSON.stringify(e.currentTarget.dataset.data)
    })
    wx.navigateTo({
      url: '../../packageC/pages/NewsDetail/NewsDetail'
    })
  },
  /**
   *  加载过程
   */
  onLoad: function () {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.navigateTo({
      url: '../../packageC/pages/VideosDetail/VideosDetail'
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        })
        _this.getNews('社会', 0)
      }
    })
  },
  getNews: async function (type, page) {
    let _this = this
    let result = []
    _this.setData({
      spinLoad: true,
      hot: ''
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/news/showNews`,
      method: "GET",
      data: {
        type: type,
        page: page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    result = await request.requestUtils(Item)
    _this.setData({
      hot: result,
      spinLoad: false
    })
  },
  getVideos: async function (page) {
    let _this = this
    let result = []
    _this.setData({
      spinLoad: true,
      hot: ''
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/news/showVideos`,
      method: "GET",
      data: {
        page: page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    result = await request.requestUtils(Item)
    _this.setData({
      videos: result,
      spinLoad: false
    })
  },
  showVideo: function (e) {
    // e.currentTarget.dataset.video
    wx.setStorage({
      key: "video",
      data: e.currentTarget.dataset.video
    })
    wx.navigateTo({
      url: '../../packageC/pages/VideosDetail/VideosDetail'
    })
  }
})