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
        wx.setNavigationBarTitle({ title: dataTemp.new_title })
        if (dataTemp.new_iframe == 'http:undefined' || dataTemp.new_iframe == undefined) { // 没视频的时候
          var article = dataTemp.new_content
          WxParse.wxParse('article', 'html', article, _this, 5);
          _this.setData({
            spinShow: false
          })
        } else { //有视频的时候
          let video_url = dataTemp.new_content.split("video src=")[1].split("\">")[0].replace(/[\"]/g, "")
          // 检测视频是否有效
          _this.testVideo(video_url, dataTemp.new_content, dataTemp._id, dataTemp.new_iframe)
        }
      }
    })
  },
  /**
   * 检测视频是否有效
   * @param {*} url 视频地址
   * @param {*} content 正文
   * @param {*} id 新闻ID
   * @param {*} from_url 来自那篇文章
   */
  testVideo: function (url, content, id, from_url) {
    let _this = this
    wx.request({
      url: url,
      success(res) {
        if (res.statusCode == 200) { // 视频有效
          WxParse.wxParse('article', 'html', content, _this, 5);
          _this.setData({
            spinShow: false
          })
        } else { // 视频无效
          wx.getStorage({
            key: 'Token',
            success(res) {
              // 更新视频
              _this.getUpdateVideo(id, from_url, res.data)
            }
          })
        }
      }
    })
  },
  /**
   * 更新视频
   * @param {*} id 新闻ID
   * @param {*} from_url 来自那篇文章
   * @param {*} token token
   */
  getUpdateVideo: async function (id, from_url, token) {
    let _this = this;
    let Item = {
      url: `http://${app.ip}:5001/mini/news/updateVideo`,
      method: "POST",
      data: {
        _id: id,
        url: from_url
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    let result = await request.requestUtils(Item)

    var article = result.new_content
    WxParse.wxParse('article', 'html', article, _this, 5);

    _this.setData({
      dataNews: result,
      spinShow: false
    })
  }
})