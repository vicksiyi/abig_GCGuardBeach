const app = getApp();
const request = require('../../../../utils/requests');
const { $Message } = require('../../../../dist/base/index');
var status = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    token: '',
    value: [],
    scrollTop: 0,
    topWidth: 160,
    topHeight: 160,
    fontShowMsg: true,
    image: '',
    num: 0,
    statusFocus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.setNavigationBarTitle({ title: `${options.type}圈` })
    _this.setData({
      type: options.type
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        _this.getFirstData(res.data, options.type, result => {
          if (result.length < 10) {
            _this.setData({
              endLoad: true
            })
          }
          _this.setData({
            value: result
          })
          wx.hideLoading()
        })
        _this.getImage(res.data, options.type, result => {
          _this.setData({
            image: result.image,
            num: result.num,
            statusFocus: result.status
          })
        })
      }
    })
    wx.getSystemInfo({
      success(res) {
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#wrapper').boundingClientRect()
        query.exec(function (re) {
          _this.setData({
            windowHeight: res.windowHeight,
            height: res.windowHeight - re[0].height
          })
        });
      }
    })
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.image,
      current: e.currentTarget.dataset.url
    })
  },
  // 首页数据获取
  getFirstData: function (token, type, back) {
    let _this = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/showFocus`,
      method: "GET",
      data: {
        type: type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    try {
      request.requestUtils(Item, result => {
        back(result)
      })
    } catch (err) {
      console.log(err)
    }
  },
  bottomChange: function () {
    let _this = this
    // 到底了就不添加了
    if (!_this.data.endLoad) {
      // 加载
      _this.setData({
        endShow: true
      });
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      // 获取数据
      let Item = {
        url: `http://${app.ip}:5001/mini/chats/showPageFocus`,
        method: "GET",
        data: {
          time: _this.data.value[_this.data.value.length - 1].time
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': _this.data.token
        }
      };
      try {
        request.requestUtils(Item, result => {
          let valueTemp = _this.data.value;
          if (result.length < 10) {
            _this.setData({
              endLoad: true,
              endShow: false
            })
            status++
          }
          if (status < 2) {
            // 添加
            valueTemp.push(...result)
            _this.setData({
              value: valueTemp,
              endShow: false
            })
          }
          wx.hideLoading()
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  scrollChange: function (e) {
    let _this = this
    if (e.detail.scrollTop <= 160) {
      _this.setData({
        topWidth: (160 - e.detail.scrollTop) < 0 ? 0 : 160 - e.detail.scrollTop,
        topHeight: (160 - e.detail.scrollTop) < 0 ? 0 : 160 - e.detail.scrollTop,
        fontShowMsg: (160 - e.detail.scrollTop) >= 40 ? true : false
      })
    } else {
      _this.setData({
        topWidth: 0,
        topHeight: 0,
        fontShowMsg: false
      })
    }
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#wrapper').boundingClientRect()
    query.exec(function (re) {
      _this.setData({
        height: _this.data.windowHeight - re[0].height
      })
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 类别获取图片&关注数&状态
  getImage: function (token, type, back) {
    let _this = this
    // 获取数据
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/showTypeOne`,
      method: "GET",
      data: {
        type: type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    request.requestUtils(Item, result => {
      back(result)
    })
  },
  // 关注
  focusChange: function () {
    let _this = this
    // 获取数据
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/focus`,
      method: "GET",
      data: {
        type: _this.data.type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    request.requestUtils(Item, result => {
      if (result.msg == "Success") {
        $Message({
          content: '关注成功',
          type: 'success'
        });
        _this.setData({
          statusFocus: true
        })
      } else {
        $Message({
          content: '取消关注成功',
          type: 'success'
        });
        _this.setData({
          statusFocus: false
        })
      }
    })
  }
})