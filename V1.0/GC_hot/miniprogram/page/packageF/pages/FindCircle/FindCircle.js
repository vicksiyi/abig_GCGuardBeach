const request = require("../../../../utils/requests");
const app = getApp();
const Location = require('../../../../utils/locations');
const locations = new Location();
const QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
const qqmapsdk = new QQMapWX({
  key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
});
var status = 0  //防止异步问题再添加一个
Page({

  data: {
    value: [],
    token: '',
    load: false,
    height: 0,
    page: 0,
    endLoad: false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      load: true
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
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
    let _this = this;
    let Item = {
      url: `http://${app.ip}:5001/mini/finds?page=${page}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    try {
      let result = await request.requestUtils(Item)
      let tempPlace = {};
      let temp = ''
      result.map((value, index) => {
        result[index].time = value.time.split("T")[0]
        result[index].picture = JSON.parse(value.picture)
        tempPlace = JSON.parse(value.place)
        // 阻塞
        locations.sleep(300);
        // 获取位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: tempPlace.latitude,
            longitude: tempPlace.longitude
          },
          sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',
          success: function (res) {
            temp = 'value[' + (index + page * 10) + '].str';
            _this.setData({
              [temp]: res.result.address
            })
          },
          fail: function (error) {
            console.error(error);
          }
        });
      })
      return result
    } catch (err) {
      console.log(err)
    }
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
      'longitude': res.longitude,
      'name': e.currentTarget.dataset.str
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + `&sign=${sig}`
    });
  },
  // 到底部时候触发
  bottomChange: function () {
    let _this = this;
    // 到底了就不添加了
    if (!_this.data.endLoad) {
      (async () => {
        // 加载
        _this.setData({
          endShow: true
        });
        // 获取数据
        let result = await _this.getFindData(_this.data.page + 1, _this.data.token)

        let valueTemp = _this.data.value;
        if (result.length < 10) {
          _this.setData({
            endLoad: true,
            endShow: false
          })
          status++
        } else {
          _this.setData({
            page: _this.data.page + 1
          })
        }
        console.log(result)
        if (status < 2) {
          // 添加
          valueTemp.push(...result)
          _this.setData({
            value: valueTemp,
            endShow: false
          })
        }
      })()
    }
  }
})