const app = getApp();
const request = require('../../../../utils/requests');
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
      _this.setData({
        value: result,
        spinLoad: false
      })
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
          _this.setData({
            value: result,
            spinLoad: false
          })
        })()
      }
    })
  },
  joinIn: function (e) {
    wx.navigateTo({
      url: `../volunteerJoin/volunteerJoin?id=${e.currentTarget.dataset.id}` 
    })
  }
})