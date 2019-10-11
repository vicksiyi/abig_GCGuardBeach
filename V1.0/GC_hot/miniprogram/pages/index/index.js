const {
  $Message
} = require('../../dist/base/index');
const QQMapWX = require('../../utils/qqmap-wx-jssdk');
const requests = require('../../utils/requests')
const weatherLogoList = require('../../utils/weatherLogo')
const utils = require('../../utils/util')
var qqmapsdk;
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
    animTranspond: {}, //item位移,透明度
    weatherResult: '',
    spinShow: false,
    weatherColorList: ['green', 'yellow', 'red'],
    weatherColor: 'green',
    weatherLevel: ['优', '良', '差'],
    weatherLogoList: weatherLogoList.weatherLogo,
    weatherLogo: '../../images/weatherLogo/999.png',
    thisWeekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    thisWeekListTime: utils.thisWeek(),
    thisWeek: '星期一',
    newTime: ''
  },
  /**
   * 点击弹出
   */
  plus: function () {
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
  transpond: function () {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  collect: function () {
    wx.navigateTo({
      url: '../find/find',
    })
  },
  //弹出动画
  /**
   * 弹出动画
   */
  popp: function () {
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
  takeback: function () {
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
  onLoad: function () {
    var _this = this;

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
    });
    _this.setData({
      spinShow: true
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数 
          //Object格式
          location: {
            latitude: latitude,
            longitude: longitude
          },
          sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',

          success: function (res) {//成功后的回调
            _this.setData({
              start: [res.result.address_component.city,'-', res.result.address_component.district,'-',res.result.address_component.street_number].join("")
            })
            // 传入位置，返回天气
            let item = {
              url: 'https://www.toutiao.com/stream/widget/local_weather/data/',
              data: {
                city: res.result.address_component.district
              },
              method: 'GET',
              header: {}
            }
            // 天气
            let num = 0 // 只作一次更改
            let event = async (itemTemp) => {
              let result = await requests.requestUtils(itemTemp)
              // 如果区域没有搜索到，则进行市区查询
              if (result.data.city != res.result.address_component.district && num <= 0) {
                num++ // 防止两次打印
                item.data.city = res.result.address_component.city
                return event(item)
              }

              // 空气质量颜色问题
              _this.weatherColorFun(result.data.weather.quality_level)

              // 根据气候选Logo
              _this.weatherLogoFun(result.data.weather.dat_condition)

              // 星期数
              _this.weatherWeek()

              _this.setData({
                weatherResult: result.data.weather,
                spinShow: false
              })
              console.log(result.data.weather)
            }
            event(item)
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (res) {
            console.log(res);
          }
        })

      }
    })
    /**
     * 查看是否授权
     */
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
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
          _this.setData({
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
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        _this.setData({
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
  // /**
  //  * 授权登录
  //  */
  // bindGetUserInfo: function (e) {
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     var that = this;
  //     // 获取到用户的信息了，打印到控制台上看下
  //     console.log("用户的信息如下：");
  //     console.log(e.detail.userInfo);
  //     wx.setStorage({
  //       key: "name",
  //       data: e.detail.userInfo.nickName
  //     })
  //     wx.setStorage({
  //       key: "avatar",
  //       data: e.detail.userInfo.avatarUrl
  //     })
  //     //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
  //     that.setData({
  //       isHide: false
  //     });
  //     wx.showTabBar({});
  //   } else {
  //     //用户按了拒绝按钮
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         // 用户没有授权成功，不需要改变 isHide 的值
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     });
  //   }
  // },
  login:function(){
  wx.redirectTo({
    url: '../login/login',
  })
  },
  /**
  * 空气质量颜色问题
  * @param {quality_level} 空气质量
  */
  weatherColorFun: function (quality_level) {
    let _this = this
    let numTempLevel = _this.data.weatherLevel.indexOf(quality_level)

    if (numTempLevel != -1) {
      _this.setData({
        weatherColor: _this.data.weatherColorList[numTempLevel]
      })
    }

  },
  /**
  * 空气LOGO问题
  * @param {dat_condition} 气候
  */
  weatherLogoFun: function (dat_condition) {
    let _this = this
    console.log(dat_condition)
    let dat_condition_list = []
    for (let i = 0; i < _this.data.weatherLogoList.length; i++) {
      dat_condition_list.push(_this.data.weatherLogoList[i].name)
    }
    let numTemp = dat_condition_list.indexOf(dat_condition)
    if (numTemp == -1) {
      let numTemp2 = dat_condition_list.indexOf(dat_condition.split('转')[0])
      if (numTemp2 != -1) {
        _this.setData({
          weatherLogo: _this.data.weatherLogoList[numTemp2].url
        })
      }
    } else {
      _this.setData({
        weatherLogo: _this.data.weatherLogoList[numTemp].url
      })
    }
  },
  /**
  * 星期数
  */
  weatherWeek: function () {
    let _this = this
    let numTemp = _this.data.thisWeekListTime.indexOf(utils.formatTime(new Date).split(" ")[0].replace('/', '-').replace('/', '-'))
    _this.setData({
      newTime: utils.formatTime(new Date).split(" ")[0].replace('/', '年').replace('/', '月'),
      thisWeek: _this.data.thisWeekList[numTemp]
    })
  }
})