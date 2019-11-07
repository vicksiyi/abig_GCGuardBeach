const app = getApp();
const request = require('../../../../utils/requests');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: {},
    spinShow: false,
    person: [
      {
        name: '孔孔',
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/2yIongiauHyj3Nrp1ogd2tP4wfgbibgVdGwXemYhiaFFrVoVuGZwm0qQ2uE8A7rApWMWubtJJ34Kib0ZXGRP97scxQ/132',
        time: '2019-10-30'
      },
      {
        name: '博士',
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIBhKlVSP7RQhIZFKTH7zAONdJKqj7oUhUE7dyckOkScZJfHnTzqUtTVASaND2CAT6xUxKYqZeXEw/132',
        time: '2019-10-30'
      },
      {
        name: 'GC怪兽',
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/HpGXpDeYfc4nupOOcx6tTictib6Rf5PlEkMjV4Iiakb1jBnylCYw0Acv1SveqibVciabuuaDgVobibTwygD58ktSqcjA/132',
        time: '2019-10-30'
      }
    ],
    autoplay: true,
    interval: 2000,
    num: 2,
    key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let result = {}
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
        (async () => {
          let Item = {
            url: `http://${app.ip}:5001/mini/msgs/${options.id}`,
            method: "GET",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': res.data
            }
          };
          result = await request.requestUtils(Item)
          _this.setData({
            value: result,
            spinShow: false
          })
        })()
      }
    })
  },
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
  }
})