const request = require("../../../../utils/requests");
const app = getApp();
const Location = require('../../../../utils/locations');
const locations = new Location();
Page({

  data: {
    value: [],
    token: '',
    load: false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      load: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        (async () => {
          let result = await _this.getFindData(0, res.data)
          _this.setData({
            load: false,
            value: result
          })
        })()
      }
    })
  },
  /**
   * 获取发现信息
   * @param {*} page 第几页
   * @param {*} token token
   */
  getFindData: async function (page, token) {
    let Item = {
      url: `http://${app.ip}:5001/mini/finds?page=${page}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    let result = await request.requestUtils(Item)
    let tempPlace = {};
    result.map((value, index) => {
      result[index].time = value.time.split("T")[0]
      result[index].picture = JSON.parse(value.picture)
      tempPlace = JSON.parse(value.place)
      // 阻塞
      locations.sleep(300);
      // 获取位置
      (async () => {
        let str = await locations.msg(tempPlace.latitude, tempPlace.longitude)
        console.log(str)
      })()
    })
    return result
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },
  // 评论
  msgMode: function () {
    console.log('评论')
  },
  // 号召
  zhaoMode: function () {
    console.log('号召')
  },
  // 分享
  enjoyMode: function () {
    console.log('分享')
  },
  // 导航
  map: function (e) {
    let _this = this
    let res = JSON.parse(_this.data.value[e.currentTarget.dataset.index].place)

    let key = "CWXBZ-JSM6U-KCJV5-2MKJ7-R6PO3-GZBA3"
    let referer = "GC海滩卫士"
    let sig = "urDytR73uaBhazdaVhHsk4j1NEDiP0"

    let endPoint = JSON.stringify({  //终点
      'latitude': res.latitude,
      'longitude': res.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + `&sign=${sig}`
    });
  },
  // 根据坐标返回位置
  locationMsg: function (latitude, longitude) {
    locations.msg(latitude, longitude)
  }
})