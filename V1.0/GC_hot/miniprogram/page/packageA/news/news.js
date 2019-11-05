const app = getApp()
const request = require('../../../utils/requests')
Page({
  data: {
    current: 0,
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
    video: [
      {
        id: 1,
        title: '7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
        src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        time: '2019/10/31 21：58',
        source: '快手'
      },
      {
        id: 2,
        title: '7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
        src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        time: '2019/10/31 21：58',
        source: '快手'
      }
    ],
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
    if (detail != 1) {
      _this.getNews(_this.data.keys[detail.key], 0)
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
    console.log(result)
    _this.setData({
      hot: result,
      spinLoad: false
    })
  }
})