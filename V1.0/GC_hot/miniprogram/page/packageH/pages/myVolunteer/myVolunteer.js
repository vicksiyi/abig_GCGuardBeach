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
        (async () => {
          let result = await _this.showMsg(res.data, 'myMsg')
          _this.setData({
            value: result,
            spinLoad: false
          })
        })()
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
  showMsg: async function (token, event) {
    // mySuccessMsg
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/${event}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    let result = await request.requestUtils(Item)
    return result
  },
  joinIn: function (e) {
    wx.navigateTo({
      url: `../myOrganization/myOrganization?id=${e.currentTarget.dataset.id}`
    })
  },
  show: function (e) {
    wx.navigateTo({
      url: `../../../packageB/pages/volunteerJoin/volunteerJoin?id=${e.currentTarget.dataset.id}`
    })
  }
})