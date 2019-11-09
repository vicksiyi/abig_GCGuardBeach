const app = getApp();
const request = require('../../../../utils/requests');
// const Num = require('../../resources/js/num');
const QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
const Utils = require('../../../../utils/util');
const utils = new Utils();
var qqmapsdk;
Page({
  data: {
    value: [],
    spinLoad: false,
    inputVal: '',
    token: ''
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    // getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    // getList(this);
  },
  inputTyping: function (e) {
    let _this = this
    let result = ''
    _this.setData({
      spinLoad: true,
      inputVal: e.detail.value,
      value: ''
    });
    (async () => {
      let Item = {
        url: `http://${app.ip}:5001/mini/msgs/show`,
        method: "GET",
        data: {
          keyword: e.detail.value
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': _this.data.token
        }
      };
      result = await request.requestUtils(Item)

      // 添加距离
      _this.calLocation(result)
    })()
  },
  onLoad: function () {
    let _this = this
    let result = []
    _this.setData({
      spinLoad: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        (async () => {
          let Item = {
            url: `http://${app.ip}:5001/mini/msgs/showMsgs`,
            method: "GET",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': res.data
            }
          };
          result = await request.requestUtils(Item)

          // 添加距离
          _this.calLocation(result)
        })()
      }
    })
  },
  joinIn: function (e) {
    wx.navigateTo({
      url: `../volunteerJoin/volunteerJoin?id=${e.currentTarget.dataset.id}`
    })
  },
  // 距离计算
  calLocation: function (result) {
    let _this = this
    qqmapsdk = new QQMapWX({
      key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O' // 必填
    });
    let dest = []
    result.map((value, index) => {
      dest = [{
        latitude: value.msg_latitude,
        longitude: value.msg_longitude
      }]
      //调用距离计算接口
      qqmapsdk.calculateDistance({
        to: dest, //终点坐标
        sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',
        success: function (res) {//成功后的回调
          //  米转公里
          result[index].msg_distance = utils.distanceFormat(res.result.elements[0].distance)

          _this.setData({
            value: result,
            spinLoad: false
          })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    });
  }
})