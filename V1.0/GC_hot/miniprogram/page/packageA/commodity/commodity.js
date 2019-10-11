Page({
  data: {
    store: [],
    active: 0,
    currentTab: 0,
    science: [{
        id: 1,
        picture: 'https://img13.360buyimg.com/n1/s200x200_jfs/t18412/89/1210128942/433322/e2c0fecb/5abda998N22e4ad6c.jpg',
        name: '海洋百科',
        content: 'BBC蓝色星球II [英]詹姆斯.霍尼伯内 马克.布朗罗著',
        price: '1260',
        num: 1,
        selected: false
      }, {
        id: 2,
        picture: 'https://img14.360buyimg.com/n1/s200x200_jfs/t5992/59/4558255428/1351988/429e072b/5962f5bfNde8054fc.jpg',
        name: '深水探秘',
        content: 'BBC科普三部曲海洋 [英]保尔·罗斯 安妮·莱金 著',
        price: '710',
        num: 1,
        selected: false
      },
      {
        id: 3,
        picture: 'https://img14.360buyimg.com/n1/s200x200_jfs/t1/7219/37/6341/428004/5be1420aEdc24573e/77b1594062670fb5.jpg',
        name: '无尽深蓝',
        content: '未读探索家海洋摄影作品 西尔维亚A厄尔著',
        price: '1260',
        num: 1,
        selected: false
      },
      {
        id: 4,
        picture: 'https://img13.360buyimg.com/n1/s200x200_jfs/t1/1700/32/13788/328786/5bd94947E2c0bdc46/5ef2697d0d16c6d3.jpg',
        name: '海洋中药化学',
        content: '侯小涛邓家刚郝二伟 编',
        price: '1160',
        num: 1,
        selected: false
      },
      {
        id: 5,
        picture: 'https://img10.360buyimg.com/n1/s200x200_jfs/t13231/124/337624371/188390/1f5c6a84/5a095d09N73fa1194.jpg',
        name: '深渊',
        content: '探索海洋最深处的奥秘 [英]艾伦·杰米逊著',
        price: '1040',
        num: 1,
        selected: false
      },
    ],
    gooditem: [{
        name: '科普读物'
      },
      {
        name: '童书'
      },
      {
        name: '家用摆饰'
      },
      {
        name: '精美礼品'
      },
      {
        name: '海的零食'
      },
      {
        name: '海产干货'
      },
    ],
    spinShow: false
  },
  /**
   *  左侧栏选择
   */
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
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
    setTimeout(res => {
      _this.setData({
        spinShow: false
      })
    }, 2000)
  }
})