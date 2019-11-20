var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    currentData: 0,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 ,//tab标题的滚动条位置
     inputList: [ {
      id: 1,
      title: "邮箱",
      type: "string",
      value: ""
    },
    {
         id: 2,
         title: "密码",
         type: "string",
         value: ""
       }
    ],
    registerList: [{
      id: 1,
      title: "昵称",
      type: "string",
      value: ""
    },
    {
      id: 2,
      title: "邮箱",
      type: "string",
      value: ""
      },
      {
        id: 3,
        title: "密码",
        type: "string",
        value: ""
      }
    ]

  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
   /**
   * 授权登录
   */
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      wx.reLaunch({
        url: '../index/index',
      })
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      wx.setStorage({
        key: "name",
        data: e.detail.userInfo.nickName
      })
      wx.setStorage({
        key: "avatar",
        data: e.detail.userInfo.avatarUrl
      })
      // wx.getStorage({
      //   key: 'back',
      //   success(res) {
      //     wx.navigateTo({
      //       url: `../../packageG/pages/ShowDetail/ShowDetail?_id=${res.data}`
      //     })
      //   }
      // })
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      wx.showTabBar({});
     
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  footerTap: app.footerTap
})