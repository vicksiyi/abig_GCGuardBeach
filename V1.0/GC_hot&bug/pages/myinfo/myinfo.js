Page({
  data: {
    inputList: [{
        id: 1,
        title: "微信昵称",
        type: "string",
        placeholder: "",
        value: ""
      },
      {
        id: 2,
        title: "姓名",
        type: "string",
        placeholder: "真实姓名",
        value: ""
      },
      {
        id: 3,
        title: "手机号码",
        type: "number",
        placeholder: "常用手机号码",
      },
      {
        id: 4,
        title: "邮箱",
        type: "string",
        placeholder: "常用邮箱",
        value: ""
      }
    ]
  },
  onLoad: function() {
    let _this = this
    var name = wx.getStorageSync('name')
    var value = 'inputList[0].value';
    _this.setData({
      [value]: name
    })
    console.log(name)
  }
})