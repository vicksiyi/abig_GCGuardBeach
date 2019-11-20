const app = getApp();
const request = require('../../../../utils/requests');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    value: [],
    spinLoad: false,
    statusTap: ['undefined', 'true']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      spinLoad: true
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        _this.showMsg(res.data, 'myMsg', result => {
          _this.setData({
            value: result,
            spinLoad: false
          })
        })
      }
    })
  },
  handleChange({ detail }) {
    let _this = this
    _this.setData({
      current: detail.key,
      currentTap: _this.data.statusTap[detail.key]
    });
  },
  showMsg: function (token, event, back) {
    // mySuccessMsg
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/${event}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    request.requestUtils(Item, result => {
      back(result)
    })
  },
  joinIn: function (e) {
    let _this = this
    let res = _this.data.value[e.currentTarget.dataset.id]
    wx.navigateTo({
      url: `../myOrganization/myOrganization?id=${res._id}&title=${res.msg_title}`
    })
  },
  show: function (e) {
    let _this = this
    let res = _this.data.value[e.currentTarget.dataset.id]
    wx.navigateTo({
      url: `../../../packageB/pages/volunteerJoin/volunteerJoin?id=${res._id}`
    })
  }
})