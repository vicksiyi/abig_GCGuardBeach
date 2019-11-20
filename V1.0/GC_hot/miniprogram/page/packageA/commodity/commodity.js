const request = require('../../../utils/requests');
const app = getApp();
Page({
  data: {
    store: [],
    active: 0,
    currentTab: 0,
    category: [],
    spinShow: false,
    windowHeight: '',
    scrollTop: 0,
    token: '',
    baseUrl: 'cloud://kkworkspace-4sdw7.6b6b-kkworkspace-4sdw7-1300292448/store/'
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
  detail: function (e) {
    wx.navigateTo({
      url: `../../packageG/pages/ShowDetail/ShowDetail?_id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   *  加入购物车
   */
  tap: function (res) {
    // this.data.array[res.currentTarget.dataset.id]
    let _this = this
    // let storeTemp = _this.data.store
    wx.navigateTo({
      url: `../show/show?type=${res.currentTarget.dataset.type}&name=${res.currentTarget.dataset.name}`
    })
    //向数组的末尾添加一个或多个元素，并返回新的长度
    // storeTemp.push(_this.data.science[res.currentTarget.dataset.id])
    // _this.setData({
    //   store: storeTemp
    // })

    // wx.setStorage({
    //   key: 'store',
    //   data: JSON.stringify(storeTemp)
    // })
    // wx.showModal({
    //   title: '提示',
    //   content: '是否加入兑换车？',
    //   success(res) {
    //     if (res.confirm) {
    //       wx.showToast({
    //         title: '加入成功',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     } else if (res.cancel) {
    //       wx.showToast({
    //         title: '已取消',
    //         icon: 'loading',
    //         duration: 1000
    //       })
    //     }
    //   }
    // })
  },
  /**
   *  加载过程
   */
  onLoad: function () {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        })
        _this.getList(res.data, result => {
          let valueTemp = [{}]
          let oneType = []
          let i = 0;
          result.map((value, index) => {
            if (oneType.indexOf(value.type) == -1) {
              i = oneType.push(value.type)
              valueTemp[i - 1] = {}
              valueTemp[i - 1].select = new Array();
              valueTemp[i - 1].title = value.type
            }
            valueTemp[oneType.indexOf(value.type)].select.push({
              imageBg: value.imageBg,
              images: value.images,
              inventory: value.inventory,
              money: value.money,
              msg: value.msg,
              name: value.name,
              price: value.price,
              _id: value._id
            })
          })
          _this.setData({
            store: valueTemp,
            spinShow: false
          })
        });
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
    // console.log(e)
    if ((e.detail.scrollTop / 300) > 4.1) {
      id = 5
    } else {
      id = parseInt(e.detail.scrollTop / 300)
    }
    _this.setData({
      active: id
    })
  },
  // 获取购物车列表
  getList: function (token, back) {
    let Item = {
      url: `http://${app.ip}:5001/mini/stores/list`,
      header: {
        'Authorization': token
      }
    };
    request.requestUtils(Item, result => {
      back(result)
    })
  }
})