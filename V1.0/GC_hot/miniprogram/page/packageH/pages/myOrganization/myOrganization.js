const app = getApp()
var wxst = function () { }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: []
  },
  onLoad:function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let _this = this
    wxst = wx.connectSocket({
      url: `ws://${app.ip}:5002`,
      header: {
        'content-type': 'application/json'
      }
    })
    
    wxst.onOpen(res => {
      console.info('连接打开成功');
    });
    wxst.onError(res => {
      console.info('连接识别');
      console.error(res);
    });
    wxst.onMessage(res => {
      console.info(res.data);
    });
    wxst.onClose(() => {
      console.info('连接关闭');
    });
  },
  formSubmit: function (e) {
    console.log(e.detail.value.input)
    if (wxst.readyState == wxst.OPEN) {
      wxst.send({
        data: e.detail.value.input,
        success: () => {
          console.info('客户端发送成功');
        }
      });
    } else {
      console.error('连接已经关闭');
    }
  }
})