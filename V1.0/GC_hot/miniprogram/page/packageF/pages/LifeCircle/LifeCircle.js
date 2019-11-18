const app = getApp()
const request = require('../../../../utils/requests');
const { $Message } = require('../../../../dist/base/index');
var status = 0
var upShowSc = false; // 飞机状态
var tempSc = 0; // 上一次高度 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ["全部", "关注", "精选"],
    selectList: '全部',
    height: 0,
    value: [],
    scollTop: 0,
    current: 0,
    endShow: false,
    endLoad: false
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
    _this.setData({
      endShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        _this.getLife(res.data, result => {
          _this.setData({
            value: result,
            endShow: false
          })
          wx.hideLoading()
        })
      }
    })
  },

  // 列表事件
  listChange: function (e) {
    let _this = this
    let id = e.currentTarget.dataset.id
    _this.setData({
      selectList: _this.data.list[e.currentTarget.dataset.id],
      current: id,
      endLoad: false,
      scollTop: 0,
      endShow: true,
      value: []
    })
    status = 0
    // 点击触发事件
    _this.event(id)
  },
  // 滑动改变
  currentChange: function (e) {
    let _this = this
    _this.setData({
      selectList: _this.data.list[e.detail.current],
      endLoad: false,
      scollTop: 0,
      endShow: true,
      value: []
    })
    _this.event(e.detail.current)
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.image,
      current: e.currentTarget.dataset.url
    })
  },
  write: function () {
    wx.navigateTo({
      url: '../../../packageD/pages/write/write'
    })
  },
  /**
   * 获取全部数据(首页)
   * @param {*} token token 
   * @param {*} back 回调函数
   */
  getLife: function (token, back) {
    let _this = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/show`,
      method: "GET",
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
  // 全部
  bottomChange: function () {
    let _this = this;
    let temp = ["showPage", "focusMsg", "goodPage"];
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
        url: `http://${app.ip}:5001/mini/chats/${temp[_this.data.current]}`,
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
  /**
   * 获取所关注的圈（首次获取）
   * @param {*} token token 
   * @param {*} back 回调函数
   */
  getLifeMsg: function (token, back) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/focusFirst`,
      method: "GET",
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
  /**
   * 获取精选圈（首次获取）
   * @param {*} token token 
   * @param {*} back 回调函数
   */
  getLifeGood: function (token, back) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/good`,
      method: "GET",
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
  event: function (id) {
    let _this = this
    if (id == 1) {
      _this.getLifeMsg(_this.data.token, result => {
        if (result.length < 10) {
          _this.setData({
            endLoad: true
          })
        }
        _this.setData({
          value: result,
          endShow: false
        })
        wx.hideLoading()
      })
    } else if (id == 2) {
      _this.getLifeGood(_this.data.token, result => {
        if (result.length < 10) {
          _this.setData({
            endLoad: true,
          })
        }
        _this.setData({
          value: result,
          endShow: false
        })
        wx.hideLoading()
      })
    } else {
      _this.getLife(_this.data.token, result => {
        if (result.length < 10) {
          _this.setData({
            endLoad: true
          })
        }
        _this.setData({
          value: result,
          endShow: false
        })
        wx.hideLoading()
      })
    }
  },
  // 飞鱼
  feiUp: function () {
    let _this = this
    _this.setData({
      fei: true,
    })

    setTimeout(() => {
      _this.setData({
        fei: false,
        scollTop: 0
      })
    }, 1000);
  },
  // 火箭效果
  scrollChange: function (e) {
    let _this = this
    if (e.detail.scrollTop > 100) {
      _this.setData({
        upShowTemp: true
      })

      if (tempSc > e.detail.scrollTop) {
        upShowSc = true
      } else {
        upShowSc = false
      }
      _this.setData({
        upShow: upShowSc
      })
    } else {
      _this.setData({
        upShowTemp: false
      })
    }
    tempSc = e.detail.scrollTop
  }
})