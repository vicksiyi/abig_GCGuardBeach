Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    start: "茂名-中国第一滩",
    showLeft1: false,
    max: 100,
    value: "",
    files: [],
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    rank: [{
      id: 1,
      num: 1,
      user: 'GuiStar',
      title: 'GC卫士',
      index: '1200'
    }, {
      id: 2,
      num: 2,
      user: '孔孔',
      title: 'GC护卫',
      index: '1000'
    }],
    Popping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {} //item位移,透明度
  },
  /**
   * 点击弹出
   */
  plus: function() {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  transpond: function() {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  collect: function() {
    wx.navigateTo({
      url: '../find/find',
    })
  },
  //弹出动画
  /**
   * 弹出动画
   */
  popp: function() {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-5, 60).rotateZ(180).opacity(1).step();
    animationTranspond.translate(-20, 100).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
    })
  },
  /**
   * 收回动画
   */
  takeback: function() {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    /**
     * 查看是否授权
     */
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // 用户已经授权过,不改变 isHide 的值
              // 用户授权成功后，调用微信的 wx.login 接口，从而获取code
              // wx.login({
              //   success: res => {
              // 获取到用户的 code 之后：res.code
              // console.log("用户的code:" + res.code);
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              // console.log("用户名为:" + nickName);
              wx.setStorageSync('name', nickName);
              wx.setStorageSync('avatar', avatarUrl);
              // }
              // });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
          wx.hideTabBar({});
        }
      }
    });
    /**
     * 获取当前的地理位置
     */
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    });
  },
  /**
   * 授权登录
   */
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
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
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})