Page({
  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //存放数据
    orderstore: [],
    hasList: false,
    selectAllStatus: false, //全选状态
    totalPrice: 0, //总价格
    totalCount: 0, //总数量
  },
  onLoad: function(options) {
    let _this = this
    this.setData({
      hasList: true,
    })
    wx.getStorage({
      key: 'store',
      success(res) {
        // console.log(res.data)
        _this.setData({
          carts: JSON.parse(res.data)
        })
      }
    })
    //显示页面时就调用总价格和总数量
    this.getTotalPrice();
    this.totalCount();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() { //页面显示时出现2秒的加载过程
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 2000
    });
  },
  /**
   * 当前商品选中事件
   */
  handleselectList(e) {
    //获取当前的下标
    const index = e.currentTarget.dataset.index;
    //获取是否选中状态
    const selected = this.data.carts[index].selected;
    //默认全选的复选框是选中的
    this.data.selectAllStatus = true;
    //true --- false之间的切换
    this.data.carts[index].selected = !selected;
    //循环数组，判断选中还是未选中（selected）
    for (var i = this.data.carts.length - 1; i >= 0; i--) {
      if (!this.data.carts[i].selected) {
        this.data.selectAllStatus = false;
        break;
      }
    }
    //让最后的结果显示在页面上
    this.setData({
      carts: this.data.carts,
      selectAllStatus: this.data.selectAllStatus
    });
    this.getTotalPrice();
    this.totalCount();
  },
  /**
   * 数量增加事件
   */
  handleadd(e) {
    const index = e.currentTarget.dataset.index;
    let num = this.data.carts[index].num;
    //注意此处的num不能用const申明（let声明的变量可以改变，值和类型都可以改变，没有限制。const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。）
    num = num + 1;
    this.data.carts[index].num = num;
    this.setData({
      carts: this.data.carts
    });
    this.getTotalPrice();
    this.totalCount();
  },
  /**
   * 数量减少事件
   */
  handleredus(e) {
    let index = e.currentTarget.dataset.index;
    let num = this.data.carts[index].num;
    if (num <= 1) {
      return;
    }
    num = num - 1;
    this.data.carts[index].num = num;
    this.setData({
      carts: this.data.carts
    });
    this.getTotalPrice();
    this.totalCount();
  },
  /**
   * 总价
   */
  getTotalPrice() {
    let total = 0;
    let carts = this.data.carts
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].num * carts[i].price;
      }
    }
    this.setData({
      carts: carts, //渲染数据
      totalPrice: total.toFixed(2)
    })
  },
  /**
   * 总数量
   */
  totalCount() {
    let count = 0;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        count += carts[i].num;
      }
    }
    this.setData({
      carts: carts,
      totalCount: count
    })
  },
  /**
   * 删除
   */
  handledel(e) {
    let index = e.currentTarget.dataset.index;
    let _this = this;
    let partData = this.data.carts
    if (_this.data.carts[index].selected) {
      // 对返回的本地数组进行一个遍历
      partData.forEach((carts, i) => {
        if (carts.name == _this.data.carts[index].name) {
          // 删除本地存储的当前元素
          partData.splice(i, 1)
        }
      })
      _this.setData({
        carts: partData
      })
      // 删除完后再存储
      wx.setStorage({
        key: 'store',
        data: JSON.stringify(partData),
      })
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      this.getTotalPrice();
      this.totalCount();
    } else {
      wx.showModal({
        title: '提示',
        content: '你没有选中哦！',
      })
    }
  },
  /**
   * 全选状态
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    let carts = this.data.carts
    //开始的状态为未选中，当选中时执行以下代码
    //true---false之间的切换
    selectAllStatus = !selectAllStatus;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
    this.totalCount();
  },
  /**
   * 提交兑换
   */
  handleClick(e) {
    // 选中的列表
    let partData = this.data.carts
    let selecterList = []
    for (let i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        selecterList.push(this.data.carts[i])
        partData.splice(i, 1)
        this.setData({
          carts: partData
        })
      }
    }
    wx.setStorage({
      key: 'store',
      data: JSON.stringify(partData)
    })
    wx.setStorage({
      key: 'selecterList',
      data: JSON.stringify(selecterList)
    })
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
  }
})