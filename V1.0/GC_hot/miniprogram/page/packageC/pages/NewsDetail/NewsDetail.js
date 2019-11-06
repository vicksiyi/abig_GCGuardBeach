const WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp()
const request = require('../../../../utils/requests')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataNews: [],
    spinShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.getStorage({
      key: 'dataNews',
      success(res) {
        let dataTemp = JSON.parse(res.data)
        _this.setData({
          dataNews: dataTemp
        })
        let video_url = dataTemp.new_content.split("video src=")[1].split("\">")[0].replace(/[\"]/g, "")
        if (!video_url) {
          console.log(video_url, '123')
          var article = dataTemp.new_content
          WxParse.wxParse('article', 'html', article, _this, 5);
          _this.setData({
            spinShow: false
          })
        } else {
          _this.testVideo(video_url, dataTemp.new_content, dataTemp._id, dataTemp.new_iframe)
        }
      }
    })
  },
  testVideo: function (url, content, id, from_url) {
    let _this = this
    wx.request({
      url: url,
      success(res) {
        if (res.statusCode == 200) {
          WxParse.wxParse('article', 'html', content, _this, 5);
          _this.setData({
            spinShow: false
          })
        } else {
          wx.getStorage({
            key: 'Token',
            success(res) {
              (async () => {
                let Item = {
                  url: `http://${app.ip}:5001/mini/news/updateVideo`,
                  method: "POST",
                  data: {
                    _id: id,
                    url: from_url
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': res.data
                  }
                };
                let result = await request.requestUtils(Item)
                _this.setData({
                  dataNews: result
                })
              })()
            }
          })
        }
      }
    })
  }
})