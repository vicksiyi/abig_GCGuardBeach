const { $Message } = require('../../../../dist/base/index');
const app = getApp();
const request = require('../../../../utils/requests');
Page({
  data: {
    value1: '比如在()情况下，小程序出现了()异常',
    content: '',
    max: 200,
    items: [{
      name: 'question',
      value: '漏洞问题',
      checked: 'true'
    },
    {
      name: 'advice',
      value: '功能建议'
    },
    ],
    status: '漏洞问题',
    token: ''
  },
  //字数限制 
  inputs: function (e) {
    // 获取输入框的内容
    var content = e.detail.value;
    var reg1 = /\s+/g;
    var reg2 = /[\r\n]/g;
    if (reg1.test(content)) {
      content = content.replace(/^ +| +$/g, '');
      this.setData({
        content: content
      })
    };
    if (reg2.test(content)) {
      content = content.replace(/[\r\n]/g, '');
      this.setData({
        content: content
      })
    };
    // 获取输入框内容的长度
    var len = parseInt(content.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  radioChange: function (e) {
    if (e.detail.value == 'question') {
      this.setData({
        value1: '比如在( )情况下，小程序出现了( )异常',
        status: '漏洞问题'
      });
    } else {
      this.setData({
        value1: '比如我希望加入/完善( )功能，因为( )',
        status: '功能建议'
      });
    }
  },
  submit: function () {
    let _this = this
    if (!_this.data.content) {
      $Message({
        content: '内容不能为空',
        type: 'warning'
      });
      return
    }
    wx.showLoading({
      title: '正在反馈...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/utils/feedback`,
      data: {
        type: _this.data.status,
        content: _this.data.content
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    }
    request.requestUtils(Item, result => {
      if (result.msg == "Success") {
        $Message({
          content: '反馈成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.switchTab({
            url: '../../../packageA/mine/mine'
          })
        }, 1000)
      } else {
        $Message({
          content: '反馈失败',
          type: 'error'
        });
      }
      wx.hideLoading()
    })
  },
  onLoad: function () {
    let _this = this
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        })
      }
    })
  }
})