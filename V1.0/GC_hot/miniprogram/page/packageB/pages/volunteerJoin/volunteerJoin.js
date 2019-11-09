const app = getApp();
const request = require('../../../../utils/requests');
const { $Message } = require('../../../../dist/base/index');
const Num = require('../../resources/js/num');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: {},
    spinShow: false,
    person: [],
    autoplay: true,
    interval: 2000,
    num: 2,
    key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O',
    markers: [],
    circular: true,
    token: '',
    addStatus: false,
    userNum: 0,
    show: false  //防止滑动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      spinShow: true
    })
    // options.id
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });

        // 获取已加入的人数
        _this.getUserNum(options.id, res.data);
        // 检测是否已经加入
        _this.getUserStatus(options.id, res.data);
        // 获取活动的信息
        _this.getMsg(options.id, res.data);
      }
    })
  },
  // 导航
  navMap: function () {
    let _this = this
    let key = "CWXBZ-JSM6U-KCJV5-2MKJ7-R6PO3-GZBA3"
    let referer = "GC海滩卫士"
    let sig = "urDytR73uaBhazdaVhHsk4j1NEDiP0"
    let endPoint = JSON.stringify({  //终点
      'name': _this.data.value.msg_address,
      'latitude': _this.data.value.msg_latitude,
      'longitude': _this.data.value.msg_longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + `&sign=${sig}`
    });
  },
  // 加入
  joinIn: async function () {
    let _this = this
    let result = {}
    $Message({
      content: '加载中...',
      type: 'warning',
      duration: 1
    });
    // 加入志愿者活动
    result = await _this.joinVolunteer()

    _this.setData({
      spinShow: false,
      addStatus: true
    })
    if (result.msg == "Success") {
      $Message({
        content: '加入成功',
        type: 'success'
      });
    } else if (result.msg == "Existing") {
      $Message({
        content: '已加入',
        type: 'warning'
      });
    } else if (result.msg == "End") {
      $Message({
        content: '活动已结束',
        type: 'warning'
      });
    } else {
      $Message({
        content: '未知错误,请稍后重试...',
        type: 'error'
      });
    }
  },
  joinSuccess: function () {
    wx.navigateTo({
      url: '../../../packageH/pages/myVolunteer/myVolunteer'
    })
  },
  joinVolunteer: async function () {
    let _this = this
    let result = {}
    _this.setData({
      spinShow: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/addMsgUser`,
      method: "POST",
      data: {
        msgId: _this.data.value._id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    result = await request.requestUtils(Item)
    return result
  },
  // 清洗time
  cleanTime: function (time) {
    return time.split("T")[0]
  },
  /**
   * 获取已加入的人数
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getUserNum: async function (id, token) {
    let _this = this;
    let num = new Num();
    let userNumTemp = await num.userNum(id, token);
    // 格式化 时间
    userNumTemp.user.map((value, index) => {
      userNumTemp.user[index].time = _this.cleanTime(value.time)
    })

    _this.setData({
      userNum: userNumTemp.user.length,
      person: userNumTemp.user
    })
  },
  /**
   * 检测是否已经加入
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getUserStatus: async function (id, token) {
    let _this = this;
    let num = new Num();
    let statusTemp = await num.userStatus(id, token)
    _this.setData({
      addStatus: statusTemp.status
    })
  },
  /**
   * 获取活动的信息
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getMsg: async function (id, token) {
    let _this = this;
    let result = {};
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/showOne/${id}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    // 加载信息
    result = await request.requestUtils(Item)
    let mks = []
    // 画地图logo
    mks.push({
      latitude: result.msg_latitude,
      longitude: result.msg_longitude,
      iconPath: "../../resources/images/location.png",
      width: 50,
      height: 50
    })
    _this.setData({
      value: result,
      spinShow: false,
      markers: mks,
      show: true
    })
  }
})