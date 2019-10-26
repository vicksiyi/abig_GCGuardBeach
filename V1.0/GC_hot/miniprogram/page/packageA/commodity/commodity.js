Page({
  data: {
    store: [],
    active: 0,
    currentTab: 0,
    category: [],
    spinShow: false,
    windowHeight: '',
    scrollTop: 0
  },
  /**
   *  左侧栏选择
   */
  switchNav: function (e) {
    var _this = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      _this.setData({
        currentTab: id,
        scrollTop: id * 300
      });
    }
    _this.setData({
      active: id
    });
  },
  /**
   *  右侧swiper改变
   */
  swiperChange: function (e) {
    var id = e.detail.current
    if (this.data.currentTab == id) {
      return false;
    } else {
      this.setData({
        currentTab: id
      });
    }
    this.setData({
      active: id
    });
  },
  cartbtn: function () {
    wx.navigateTo({
      url: '../../packageC/pages/commoditycar/commoditycar',
    })
  },
  /**
   *  加入购物车
   */
  tap: function (res) {
    // this.data.array[res.currentTarget.dataset.id]
    let storeTemp = this.data.store
    //向数组的末尾添加一个或多个元素，并返回新的长度
    storeTemp.push(this.data.science[res.currentTarget.dataset.id])
    this.setData({
      store: storeTemp
    })
    wx.setStorage({
      key: 'store',
      data: JSON.stringify(storeTemp)
    })
    wx.showModal({
      title: '提示',
      content: '是否加入兑换车？',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   *  加载过程
   */
  onLoad: function () {
    let _this = this
    _this.setData({
      spinShow: true
    })
    const db = wx.cloud.database()
    db.collection('abig_store').get({
      success: function (res) {
        _this.setData({
          category: res.data
        })
      },
      complete: function () {
        _this.setData({
          spinShow: false
        })
      }
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 滚动改变左栏
  scroll(e) {
    let _this = this
    let id = 0
    console.log(e)
    if ((e.detail.scrollTop / 300) > 4.1) {
      id = 5
    } else {
      id = parseInt(e.detail.scrollTop / 300)
    }
    _this.setData({
      active: id
    })
  }
})